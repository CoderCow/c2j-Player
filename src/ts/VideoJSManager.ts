module Player {
	'use strict';
	export class VideoJSManager {
		/**
		 * Id of the <video> tag to replace.
		 */
		public static VIDEOJS_ID = 'videojs';

		private player: VideoJSPlayer;
		private testPlugin: TestPlugin;

		public init(): void {
			this.testPlugin = new TestPlugin();

			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.poster = 'http://vjs.zencdn.net/v/oceans.png';
			videojsOptions.controls = true;
			videojsOptions.width = 1280;
			videojsOptions.height = 528;

			var _this = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				this.player = <VideoJSPlayer>this;

				_this.testPlugin.init(this.player);

				var source1 = <VideoJSSource>{};
				var source2 = <VideoJSSource>{};
				var source3 = <VideoJSSource>{};
				source1.src = 'http://vjs.zencdn.net/v/oceans.mp4';
				source1.type = 'video/mp4';
				source2.src = 'http://vjs.zencdn.net/v/oceans.webm';
				source2.type = 'video/webm';
				source3.src = 'http://vjs.zencdn.net/v/oceans.ogv';
				source3.type = 'video/ogg';
				this.player.src([source1, source2, source3]);
			});
		}
	}
}