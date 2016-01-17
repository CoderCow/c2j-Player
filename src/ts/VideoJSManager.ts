module Player {
	'use strict';
	export class VideoJSManager {
		/**
		 * Id of the <video> tag to replace.
		 */
		public static VIDEOJS_ID = 'videojs';

		private _userSettings: UserSettings;
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		private testPlugin: TestPlugin;

		public constructor(userSettings: UserSettings, videoData: VideoData) {
			this._userSettings = userSettings;
			this._videoData = videoData;
		}

		public init(initCompleted: () => void): void {
			this._player = null;
			this.testPlugin = new TestPlugin();

			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.defaultVolume = this._userSettings.volume;
			videojsOptions.poster = App.VIDEO_BASE_PATH + this._videoData.poster;
			videojsOptions.controls = true;
			videojsOptions.width = 1280;
			videojsOptions.height = 528;

			var _this = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				_this._player = <VideoJSPlayer>this;

				// TODO: Remove when VideoJSOptions.defaultVolume works again..
				_this._player.volume(_this._userSettings.volume);

				_this.setVideoLanguage(_this._videoData.defaultLang);

				initCompleted();
			});
		}

		public setVideoLanguage(languageCode: string) {
			var availableMedia = this._videoData.media[languageCode];
			var media: VideoJSSource[] = [];
			availableMedia.forEach((medium: MediumData) =>
				media.push(<VideoJSSource>{ src: App.VIDEO_BASE_PATH + medium.src, type: medium.type }));

			this.player.src(media);
		}

		public setSubtitleLanguage(languageCode: string) {

		}

		public get player(): VideoJSPlayer {
			return this._player;
		}
	}
}