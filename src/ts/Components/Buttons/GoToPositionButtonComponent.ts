module Player {
	'use strict';
	/** A button which changes playback position when clicked. */
	export class GoToPositionButtonComponent extends VideoJSButton {
		private _goToPosition: number;

		/**
		 * Initializes a new instance of this class.
		 * @param goToPosition The second to set playback to when this button is clicked.
		 */
		public constructor(player: VideoJSPlayer, options: VideoJSComponentOptions, goToPosition: number) {
			super(player, options);

			this._goToPosition = goToPosition;
		}

		/** @inheritdoc */
		public handleClick(event: Event) {
			this.player_.currentTime(this._goToPosition);

			super.handleClick(event);
		}
	}
}

videojs.registerComponent('GoToPositionButtonComponent', Player.GoToPositionButtonComponent);