module Player {
	'use strict';
	/**
	 * A component to replace existing video.js components with, if they are required by the component model but not useful
	 * to this player.
	 */
	export class DummyComponent extends VideoJSComponent {
		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer) {
			super(player, {
				createEl: false,
				reportTouchActivity: false
			});
		}
	}
}

// Override not required video.js components with the dummy.
videojs.registerComponent('MouseTimeDisplay', Player.DummyComponent);
videojs.registerComponent('CurrentTimeDisplay', Player.DummyComponent);
videojs.registerComponent('CaptionsButton', Player.DummyComponent);
