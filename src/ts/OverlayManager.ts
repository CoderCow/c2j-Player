module Player {
	'use strict';
	export class OverlayManager {
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		private _overlayContainer: JQuery;
		private _overlays: OverlayComponent[];
		private _visibleOverlays: { [id: number]: OverlayComponent };
		private _lastPlayerOffsetWidth: number;
		private _lastPlayerOffsetHeight: number;
		/**
		 * The overlay component which is currently pausing the video.
		 */
		private _pausingOverlay: OverlayComponent;

		public constructor(player: VideoJSPlayer, videoData: VideoData, initialLanguage: string) {
			this._player = player;
			this._videoData = videoData;
			this._overlays = [];
			this._visibleOverlays = [];
			this._pausingOverlay = null;
			this._overlayContainer = $(TemplateUtils.renderSynch('Components/OverlayContainer', {}));
			this._overlayContainer.insertAfter('.vjs-text-track-display');

			var alignOverlaysBinding = this.alignOverlays.bind(this);
			this._player.on('firstplay', alignOverlaysBinding);
			this._player.on('fullscreenchange', alignOverlaysBinding);
			$(window).resize(alignOverlaysBinding);

			this._player.on('timeupdate', this.player_timeupdate.bind(this));
			//this._player.on('seeked', this.player_timeupdate.bind(this));

			this._player.on('play', this.player_play.bind(this));

			this.setLanguage(initialLanguage);
		}

		public setLanguage(languageCode: string) {
			var overlays = this._videoData.overlays[languageCode];

			this._overlays.length = overlays.length;
			for (var i = 0; i < overlays.length; i++) {
				if (this._overlays[i] !== undefined)
					this._overlays[i].dispose();

				this._overlays[i] = new Player.OverlayComponent(this._player, this._videoData, overlays[i]);
				this._overlayContainer.append(this._overlays[i].el());
			}

			this._visibleOverlays = {};
		}

		public alignOverlays() {
			var playerWidth = this._player.el().offsetWidth;
			var playerHeight = this._player.el().offsetHeight;

			if (this._lastPlayerOffsetWidth !== playerWidth || this._lastPlayerOffsetHeight !== playerHeight) {
				var videoWidth = this._player.videoWidth();
				var haveVideoDataLoadedYet = (videoWidth !== 0);

				if (haveVideoDataLoadedYet) {
					var videoHeight = this._player.videoHeight();

					if (videoWidth > videoHeight) {
						var scale = playerWidth / videoWidth;
						this._overlayContainer[0].style.left = this._overlayContainer[0].style.right = '0';
						this._overlayContainer[0].style.top = this._overlayContainer[0].style.bottom = ((playerHeight - (videoHeight * scale)) / 2) + 'px';
					} else {
						var scale = playerHeight / videoHeight;
						this._overlayContainer[0].style.left = this._overlayContainer[0].style.right = ((playerWidth - (videoWidth * scale)) / 2) + 'px';
						this._overlayContainer[0].style.top = this._overlayContainer[0].style.bottom = '0';
					}

					this._lastPlayerOffsetWidth = playerWidth;
					this._lastPlayerOffsetHeight = playerHeight;
				}
			}
		}

		private player_timeupdate() {
			var time = (this._player.scrubbing()) ? this._player.getCache().currentTime : this._player.currentTime();

			// TODO: write a proper algorithm to find the relevant overlays
			for (var i = 0; i < this._overlays.length; i++) {
				var overlayComponent = this._overlays[i];

				if (overlayComponent !== undefined) {
					if (time >= overlayComponent.overlay.begin && time <= overlayComponent.overlay.end) {
						overlayComponent.show();
					} else {
						var isPausingOverlay = (overlayComponent === this._pausingOverlay);
						if (
							overlayComponent.overlay.pauseAtEnd && overlayComponent.isVisible && !isPausingOverlay &&
							time >= overlayComponent.overlay.end && time <= overlayComponent.overlay.end + 1  // user did not skip to another position?
						) {
							this._player.pause();
							this._pausingOverlay = overlayComponent;
							this._pausingOverlay.isPausing = true;
						} else if (!isPausingOverlay) {
							overlayComponent.hide();
						}
					}
				}
			}
		}

		private player_play() {
			if (this._pausingOverlay !== null) {
				this._pausingOverlay.hide();
				this._pausingOverlay.isPausing = false;
				this._pausingOverlay = null;
			}
		}
	}
}