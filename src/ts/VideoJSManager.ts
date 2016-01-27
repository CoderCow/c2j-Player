module Player {
	'use strict';
	export class VideoJSManager {
		/**
		 * Id of the <video> tag to replace.
		 */
		public static VIDEOJS_ID = 'videojs';
		// TODO: make configurable
		private static MEDIA_TYPE_PRIORITIES: { [type: string]: number } = {
			'video/mp4': 1,
			'video/ogg': 2,
			'video/webm': 3 // Firefox cannot handle webm too well.
		};

		private _userSettings: UserSettings;
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		private _topPane: TopPaneComponent;
		private _chapterManager: ChapterManager;
		private _subtitleManager: SubtitleManager;
		private _authorNotesManager: AuthorNotesManager;
		private _overlayManager: OverlayManager;

		public constructor(userSettings: UserSettings, videoData: VideoData) {
			this._userSettings = userSettings;
			this._videoData = videoData;

			this._topPane = null;

			this._chapterManager = null;
			this._subtitleManager = null;
			this._authorNotesManager = null;
			this._overlayManager = null;
		}

		public init(initCompleted: () => void): void {
			this._player = null;

			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.defaultVolume = this._userSettings.volume;
			// TODO: only prepend base path when a relative url is given here!
			videojsOptions.poster = App.VIDEO_BASE_PATH + this._videoData.poster;
			videojsOptions.controls = true;
			videojsOptions.fluid = true;

			var _this = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				_this._player = <VideoJSPlayer>this;

				// TODO: Remove when VideoJSOptions.defaultVolume works again..
				_this._player.volume(_this._userSettings.volume);

				var initalLanguage = _this._videoData.defaultLang;
				_this.setMediaLanguage(initalLanguage);

				_this.setupPanes(initalLanguage);
				_this.setupTimeDisplay();

				_this._chapterManager = new ChapterManager(_this._player, _this._videoData, initalLanguage);
				_this._authorNotesManager = new AuthorNotesManager(_this._player, _this._videoData, initalLanguage);
				_this._overlayManager = new OverlayManager(_this._player, _this._videoData, initalLanguage);
				_this._subtitleManager = new SubtitleManager(_this._player, _this._videoData, initalLanguage);

				initCompleted();
			});
		}

		public setTextLanguage(languageCode: string) {
			this._topPane.setTitle(this._videoData.titleByLanguage(languageCode));

			this._chapterManager.setLanguage(languageCode);
			this._subtitleManager.setLanguage(languageCode);
			this._authorNotesManager.setLanguage(languageCode);
			this._overlayManager.setLanguage(languageCode);
		}

		private setupPanes(languageCode: string) {
			var title = this._videoData.titleByLanguage(languageCode);

			this._topPane = new TopPaneComponent(this._player, title);
			this._player.addChild(this._topPane);
		}

		private setupTimeDisplay() {
			var timeComponent = this._player.controlBar.addChild(new CurrentTimeComponent(this._player));
			$('.vjs-volume-menu-button').after(timeComponent.el());

			this._player.controlBar.progressControl.seekBar.addChild(new MouseTimeDisplayComponent(this._player, this._videoData));
		}

		private setMediaLanguage(languageCode: string) {
			var availableMedia = this._videoData.mediaByLanguage(languageCode);
			availableMedia.sort((m1: MediumData, m2: MediumData) =>
				VideoJSManager.MEDIA_TYPE_PRIORITIES[m1.type] - VideoJSManager.MEDIA_TYPE_PRIORITIES[m2.type]);

			var media: VideoJSSource[] = [];
			availableMedia.forEach((medium: MediumData) =>
				media.push(<VideoJSSource>{ src: App.VIDEO_BASE_PATH + medium.src, type: medium.type }));

			this.player.src(media);
		}

		public get player(): VideoJSPlayer {
			return this._player;
		}
	}
}