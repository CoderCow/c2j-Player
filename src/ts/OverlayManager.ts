module Player {
	'use strict';
	/**
	 * Maintains multilingual overlays.
	 */
	export class OverlayManager {
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		/**
		 * A jQuery selector of the container holding all overlays.
		 * As this container is scaled, all overlays will be scaled with it to stay uniform to the video size.
		 */
		private _overlayContainer: JQuery;
		private _overlays: OverlayComponent[];
		/** The last known offset width of the player. */
		private _lastPlayerOffsetWidth: number;
		/** The last known offset height of the player. */
		private _lastPlayerOffsetHeight: number;
		/**
		 * If an overlay is currently responsible for pausing the video, it is stored here, otherwise this value
		 * is null.
		 */
		private _pausingOverlay: OverlayComponent;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, initialLanguage: string) {
			this._player = player;
			this._videoData = videoData;
			this._overlays = null;
			this._pausingOverlay = null;
			this._overlayContainer = $(TemplateUtils.renderSynch('Components/OverlayContainer', {}));
			this._overlayContainer.insertAfter('.vjs-text-track-display');

			// Events which will require the overlay container to be resized.
			var alignOverlaysBinding = this.alignOverlays.bind(this);
			this._player.on('firstplay', alignOverlaysBinding);
			this._player.on('fullscreenchange', alignOverlaysBinding);
			$(window).resize(alignOverlaysBinding);

			// Events which will require the on-screen overlays to update.
			this._player.on('timeupdate', this.player_timeupdate.bind(this));
			this._player.on('play', this.player_play.bind(this));

			this.setLanguage(initialLanguage);
		}

		/** Removes all current overlays and applies those of the given language. */
		public setLanguage(languageCode: string) {
			var overlays = this._videoData.overlaysByLanguage(languageCode);

			// Sort overlays by their beginning time.
			overlays.sort((a: OverlayData, b: OverlayData) => a.begin - b.begin);

			if (this._overlays !== null)
				this.removeAllOverlays();

			this._overlays = [];
			// Set the array size first, so later appends will not resize it (better performance).
			this._overlays.length = overlays.length;
			for (var i = 0; i < overlays.length; i++) {
				this._overlays[i] = new OverlayComponent(this._player, this._videoData, overlays[i]);
				this._overlayContainer.append(this._overlays[i].el());
			}
		}

		/** Removes all chapter markers from the overlay container. */
		public removeAllOverlays() {
			this._overlays.forEach((overlay: OverlayComponent) => overlay.dispose());
			this._overlays = [];

			this._pausingOverlay = null;
		}

		/** Resizes the overlay container and thus all overlays inside it (powered by CSS). */
		public alignOverlays() {
			var playerWidth = this._player.el().offsetWidth;
			var playerHeight = this._player.el().offsetHeight;

			if (this._lastPlayerOffsetWidth !== playerWidth || this._lastPlayerOffsetHeight !== playerHeight) {
				var videoWidth = this._player.videoWidth();
				var hasVideoDataBeenLoadedYet = (videoWidth !== 0);

				if (hasVideoDataBeenLoadedYet) {
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

		/** Event handler called whenever the player's current playback time changed. */
		private player_timeupdate() {
			var time = (this._player.scrubbing()) ? this._player.getCache().currentTime : this._player.currentTime();

			// TODO: write a proper algorithm to find the relevant overlays quickly
			for (var i = 0; i < this._overlays.length; i++) {
				var overlayComponent = this._overlays[i];

				if (overlayComponent !== undefined) {
					var isPlaybackInOverlayTimeSpan = (time >= overlayComponent.overlay.begin && time <= overlayComponent.overlay.end);
					if (isPlaybackInOverlayTimeSpan) {
						overlayComponent.show();
					} else {
						var isTheCurrentPausingOverlay = (overlayComponent === this._pausingOverlay);
						if (
							overlayComponent.overlay.pauseAtEnd && overlayComponent.isVisible && !isTheCurrentPausingOverlay &&
							time >= overlayComponent.overlay.end && time <= overlayComponent.overlay.end + 1  // user did not skip to another position?
						) {
							this._player.pause();
							this._pausingOverlay = overlayComponent;
							this._pausingOverlay.isPausing = true;
						} else if (!isTheCurrentPausingOverlay) {
							overlayComponent.hide();
						}
					}
				}
			}
		}

		/** Event handler called whenever the player's current playback status changed. */
		private player_play() {
			if (this._pausingOverlay !== null) {
				this._pausingOverlay.hide();
				this._pausingOverlay.isPausing = false;
				this._pausingOverlay = null;
			}
		}
	}
}