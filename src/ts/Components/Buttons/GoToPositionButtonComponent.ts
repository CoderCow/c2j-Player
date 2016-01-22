module Player {
	'use strict';
	export class GoToPositionButtonComponent extends VideoJSButton {
		private _goToPosition: number;

		public constructor(player: VideoJSPlayer, options: VideoJSComponentOptions, goToPosition: number) {
			super(player, options);

			this._goToPosition = goToPosition;
		}

		public handleClick(event: Event) {
			this.player_.currentTime(this._goToPosition);

			super.handleClick(event);
		}
	}
}

videojs.registerComponent('GoToPositionButtonComponent', Player.GoToPositionButtonComponent);