module Player {
	'use strict';
	/** The display of the current playback time aside of the player's play button. */
	export class CurrentTimeComponent extends VideoJSComponent {
		private _currentTimeElement: JQuery;
		private _durationTimeElement: JQuery;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer) {
			super(player, {});

			player.on('timeupdate', this.updateContent.bind(this));
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			var div = $(TemplateUtils.renderSynch('Components/CurrentTime', {
				currentTimeString: this.localize('Time')
			}));
			this._currentTimeElement = div.find('.video-current-time');
			this._durationTimeElement = div.find('.video-duration-time');

			return div[0];
		}

		/** Updates the current playback time. */
		public updateContent() {
			var time = (this.player_.scrubbing()) ? this.player_.getCache().currentTime : this.player_.currentTime();
			this._currentTimeElement.text(videojs.formatTime(time, this.player_.duration()));
			this._durationTimeElement.text(videojs.formatTime(this.player_.duration()));
		}
	}
}

videojs.registerComponent('CurrentTimeComponent', Player.CurrentTimeComponent);