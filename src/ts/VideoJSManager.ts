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

		private _playerConfig: PlayerConfig;
		private _userSettings: UserSettings;
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		private _topPane: TopPaneComponent;
		private _languageMenu: LanguageMenuComponent;
		private _chapterManager: ChapterManager;
		private _subtitleManager: SubtitleManager;
		private _authorNotesManager: AuthorNotesManager;
		private _overlayManager: OverlayManager;

		public constructor(playerConfig: PlayerConfig, userSettings: UserSettings, initCompleted: () => void) {
			this._playerConfig = playerConfig;
			this._userSettings = userSettings;

			this._topPane = null;
			this._languageMenu = null;

			this._chapterManager = null;
			this._subtitleManager = null;
			this._authorNotesManager = null;
			this._overlayManager = null;

			var metadataUrl = playerConfig.videoMetadataUrl;
			if (metadataUrl === null)
				metadataUrl = playerConfig.defaultVideoMetadataUrl;
			if (metadataUrl === null)
				throw new Exception('There were no video metadata provided.');

			this.useVideoData(metadataUrl, () =>
				this.init(initCompleted));
		}

		public init(initCompleted: () => void): void {
			this._player = null;

			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.defaultVolume = this._userSettings.volume;
			videojsOptions.poster = this.amendMediaUrl(this._videoData.poster);
			videojsOptions.controls = true;
			videojsOptions.fluid = true;
			if (this._playerConfig.playerLanguage !== null)
				videojsOptions.language = this._playerConfig.playerLanguage;
			if (this._playerConfig.startPlaybackAt !== null)
				videojsOptions.autoplay = true;

			var manager = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				manager._player = <VideoJSPlayer>this;

				// TODO: Remove when VideoJSOptions.defaultVolume works again..
				manager._player.volume(manager._userSettings.volume);

				var initalLanguage = normalizeLanguageCode(manager._player.language());
				manager.setupButtons();

				// Set playback position prior loading media, so no useless buffering will be done.
				if (manager._playerConfig.startPlaybackAt !== null)
					manager._player.currentTime(manager._playerConfig.startPlaybackAt);

				manager.setMediaLanguage(initalLanguage);

				manager._chapterManager = new ChapterManager(manager._player, manager._videoData, initalLanguage);
				if (!manager._playerConfig.disableAuthorNotes)
					manager._authorNotesManager = new AuthorNotesManager(manager._player, manager._videoData, initalLanguage);

				if (!manager._playerConfig.disableOverlays)
					manager._overlayManager = new OverlayManager(manager._player, manager._videoData, initalLanguage);

				// TODO bug: this will not auto select the language in the language menu
				var initialSubtitleLanguage: string = null;
				if (manager._playerConfig.enableSubtitleByDefault)
					initialSubtitleLanguage = initalLanguage;

				manager._subtitleManager = new SubtitleManager(manager._player, manager, initialSubtitleLanguage);

				manager.setupPanes(initalLanguage);
				manager.setupTimeDisplay();

				initCompleted();
			});
		}

		public useVideoData(fromUrl: string, loadCompleted: () => void) {
			fromUrl = this.amendMediaUrl(fromUrl);

			var reader = new Camtasia2JsonReader();
			reader.read(fromUrl, (videoData: VideoData) => {
				videoData.invalidate();
				this._videoData = videoData;

				loadCompleted();
			}, (error: Exception) => {
				console.log(error.toString());
			});
		}

		private setupPanes(languageCode: string) {
			var title = this._videoData.titleByLanguage(languageCode);

			this._topPane = new TopPaneComponent(this._player, title);
			this._player.addChild(this._topPane);
		}

		private setupButtons() {
			var languageButton = new LanguageButtonComponent(this._player, this._videoData);
			var languageMenu = <LanguageMenuComponent>languageButton.menu;

			languageMenu.on('audioLanguageChanged', () => this.setMediaLanguage(languageMenu.selectedAudioLanguage));
			languageMenu.on('extrasLanguageChanged', () => this.setExtrasLanguage(languageMenu.selectedExtrasLanguage));
			languageMenu.on('subtitleLanguageChanged', () => this.setSubtitleLanguage(languageMenu.selectedSubtitleLanguage));
			this._languageMenu = languageMenu;

			this._player.controlBar.addChild(languageButton);
			$(languageButton.el()).insertBefore('.vjs-fullscreen-control');
		}

		public setMediaLanguage(languageCode: string) {
			var availableMedia = this._videoData.mediaByLanguage(languageCode);
			availableMedia.sort((m1: MediumData, m2: MediumData) =>
				VideoJSManager.MEDIA_TYPE_PRIORITIES[m1.type] - VideoJSManager.MEDIA_TYPE_PRIORITIES[m2.type]);

			var media: VideoJSSource[] = [];
			availableMedia.forEach((medium: MediumData) => {
				var srcUrl = this.amendMediaUrl(medium.src);
				media.push(<VideoJSSource>{ src: srcUrl, type: medium.type });
			});

			this.player.src(media);
			this._languageMenu.selectedAudioLanguage = languageCode;
		}

		public setExtrasLanguage(languageCode: string) {
			this._chapterManager.setLanguage(languageCode);
			this._languageMenu.selectedExtrasLanguage = languageCode;

			if (!this._playerConfig.disableAuthorNotes)
				this._authorNotesManager.setLanguage(languageCode);

			if (!this._playerConfig.disableOverlays)
				this._overlayManager.setLanguage(languageCode);
		}

		public setSubtitleLanguage(languageCode: string) {
			this._subtitleManager.setLanguage(languageCode);
			this._languageMenu.selectedSubtitleLanguage = languageCode;
		}

		private setupTimeDisplay() {
			var timeComponent = this._player.controlBar.addChild(new CurrentTimeComponent(this._player));
			$('.vjs-volume-menu-button').after(timeComponent.el());

			this._player.controlBar.progressControl.seekBar.addChild(new MouseTimeDisplayComponent(this._player, this._videoData));
		}

		private amendMetadataUrl(url: string): string {
			if (!isAbsoluteUrl(url) && this._playerConfig.videoMetaBaseUrl !== null)
				url = this._playerConfig.videoMetaBaseUrl + '/' + url;

			return url;
		}

		private amendMediaUrl(url: string): string {
			if (!isAbsoluteUrl(url) && this._playerConfig.videoMediaBaseUrl !== null)
				url = this._playerConfig.videoMediaBaseUrl + '/' + url;

			return url;
		}

		public get player(): VideoJSPlayer {
			return this._player;
		}

		public get playerConfig(): PlayerConfig {
			return this._playerConfig;
		}

		public get videoData(): VideoData {
			return this._videoData;
		}
	}
}