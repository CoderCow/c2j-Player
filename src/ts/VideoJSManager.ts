module Player {
	'use strict';
	export class VideoJSManager {
		/**
		 * Id of the <video> tag to replace.
		 */
		public static VIDEOJS_ID = 'videojs';

		private _userSettings: UserSettings;
		private _player: VideoJSPlayer;
		private testPlugin: TestPlugin;

		public constructor(userSettings: UserSettings) {
			this._userSettings = userSettings;
		}

		public init(initCompleted: () => void): void {
			this._player = null;
			this.testPlugin = new TestPlugin();

			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.defaultVolume = this._userSettings.volume;
			videojsOptions.poster = 'http://vjs.zencdn.net/v/oceans.png';
			videojsOptions.controls = true;
			videojsOptions.width = 1280;
			videojsOptions.height = 528;

			var _this = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				_this._player = <VideoJSPlayer>this;
				// TODO: Remove when VideoJSOptions.defaultVolume works again..
				_this._player.volume(_this._userSettings.volume);

				_this.testPlugin.init(_this._player);

				var source1 = <VideoJSSource>{};
				var source2 = <VideoJSSource>{};
				var source3 = <VideoJSSource>{};
				source1.src = 'http://vjs.zencdn.net/v/oceans.mp4';
				source1.type = 'video/mp4';
				source2.src = 'http://vjs.zencdn.net/v/oceans.webm';
				source2.type = 'video/webm';
				source3.src = 'http://vjs.zencdn.net/v/oceans.ogv';
				source3.type = 'video/ogg';
				_this._player.src([source1, source2, source3]);

				initCompleted();
			});
		}

		public get player(): VideoJSPlayer {
			return this._player;
		}
	}
}