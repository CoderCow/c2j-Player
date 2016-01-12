module Player {
	'use strict';
	export class TestPlugin {
		public player: VideoJSPlayer;

		public constructor() {

		}

		public init(player: VideoJSPlayer) {
			this.player = player;

			this.player.on('play', () => {
				console.log('playback has started!');
			});
		}
	}
}