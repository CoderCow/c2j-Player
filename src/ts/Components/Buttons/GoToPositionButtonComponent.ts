module Player {
	'use strict';
	/** A button which changes playback position when clicked. */
	export class GoToPositionButtonComponent extends VideoJSButton {
		private _goToPosition: number;

		/**
		 * Initializes a new instance of this class.
		 */
		public constructor(player: VideoJSPlayer, options: IGoToPositionButtonComponentOptions) {
			super(player, { cjOptions: options });

			this._goToPosition = options.goToPosition;
		}

		/** @inheritdoc */
		public handleClick(event: Event) {
			this.player_.currentTime(this._goToPosition);

			super.handleClick(event);
		}

		public cjOptions(): IGoToPositionButtonComponentOptions {
			return super.options().cjOptions;
		}
	}
}

videojs.registerComponent('GoToPositionButtonComponent', Player.GoToPositionButtonComponent);