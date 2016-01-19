module Player {
	'use strict';
	export class DummyComponent extends VideoJSComponent {
		private _currentTimeElement: JQuery;
		private _durationTimeElement: JQuery;

		public constructor(player: VideoJSPlayer) {
			super(player, <VideoJSComponentOptions>{
				createEl: false,
				reportTouchActivity: false
			});
		}

		/**public createEl(tagName: string, properties?: any, attributes?: any) {

		}*/
	}
}

// Override not required video.js components with the dummy.
videojs.registerComponent('MouseTimeDisplay', Player.DummyComponent);
videojs.registerComponent('CurrentTimeDisplay', Player.DummyComponent);
