module Player {
	'use strict';
	/**
	 * Maintains a videojs instance and all extensions to it.
	 */
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

		/** Gets the current player configuration data. */
		private _playerConfig: PlayerConfig;
		/** Gets the current user settings (such as current volume, mute status etc.). */
		private _userSettings: UserSettings;
		/** The current videojs player instance. */
		private _player: VideoJSPlayer;
		/** Represents the video metadata (where data origin is a Camtasia2Json file). */
		private _videoData: VideoData;
		/** Represents the top pane of the player. */
		private _topPane: TopPaneComponent;
		/** Represents the language selection menu. */
		private _languageMenu: LanguageMenuComponent;
		/** Maintains multilingual chapters and their markers on the timeline. */
		private _chapterManager: ChapterManager;
		/** Maintains multilingual subtitles. */
		private _subtitleManager: SubtitleManager;
		/** Maintains multilingual author notes and their markers on the timeline. */
		private _authorNotesManager: AuthorNotesManager;
		/** Maintains multilingual overlays. */
		private _overlayManager: OverlayManager;

		/**
		 * Initializes a new instance of this class and reads the video metadata as configured in the playerConfig instance
		 * and calls the given initCompleted function when done.
		 * @throws {Exception} When no video metadata were given.
		 */
		public constructor(playerConfig: PlayerConfig, userSettings: UserSettings, initCompleted: (error: Exception) => void) {
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

			this.useVideoData(metadataUrl, (error: Exception) => {
				if (error === null)
					this.init(initCompleted);
				else
					initCompleted(error);
			});
		}

		/** Initializes the videojs player instance and applies all modifications. */
		public init(initCompleted: (error: Exception) => void): void {
			this._player = null;

			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.defaultVolume = this._userSettings.volume;
			videojsOptions.poster = this.prependMediaUrl(this._videoData.poster);
			videojsOptions.controls = true;
			videojsOptions.fluid = true;
			videojsOptions.playbackRates = [0.5, 1, 1.5, 2, 3];
			if (this._playerConfig.playerLanguage !== null)
				videojsOptions.language = this._playerConfig.playerLanguage;
			if (this._playerConfig.startPlaybackAt !== null)
				videojsOptions.autoplay = true;

			var manager = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				var error: Exception = null;
				try {
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
					if (manager._playerConfig.enableSubtitlesByDefault)
						initialSubtitleLanguage = initalLanguage;

					manager._subtitleManager = new SubtitleManager(manager._player, manager, initialSubtitleLanguage);

					manager.setupPanes(initalLanguage);
					manager.setupTimeDisplay();
				} catch (thrownError) {
					error = <Exception>thrownError;
				}

				initCompleted(error);
			});
		}

		/**
		 * Loads the video metadata from the given url and applies it, then
		 * calls the given loadCompleted function.
		 */
		public useVideoData(fromUrl: string, loadCompleted: (error: Exception) => void) {
			fromUrl = this.prependMediaUrl(fromUrl);

			var reader = new Camtasia2JsonReader();
			reader.read(fromUrl, (videoData: VideoData) => {
				videoData.invalidate();
				this._videoData = videoData;

				loadCompleted(null);
			}, (error: Exception) => {
				loadCompleted(error);
			});
		}

		/** Creates the custom top pane of the player. */
		private setupPanes(languageCode: string) {
			var title = this._videoData.titleByLanguage(languageCode);

			this._topPane = new TopPaneComponent(this._player, title);
			this._player.addChild(this._topPane);
		}

		/** Creates additional buttons in the bottom pane. */
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

		/** Sets the language of the played media to the given language. */
		public setMediaLanguage(languageCode: string) {
			var availableMedia = this._videoData.mediaByLanguage(languageCode);
			availableMedia.sort((m1: MediumData, m2: MediumData) =>
				VideoJSManager.MEDIA_TYPE_PRIORITIES[m1.type] - VideoJSManager.MEDIA_TYPE_PRIORITIES[m2.type]);

			var media: VideoJSSource[] = [];
			availableMedia.forEach((medium: MediumData) => {
				var srcUrl = this.prependMediaUrl(medium.src);
				media.push(<VideoJSSource>{ src: srcUrl, type: medium.type });
			});

			this.player.src(media);
			this._languageMenu.selectedAudioLanguage = languageCode;
		}

		/** Sets the language of all extra content, such as author notes and overlays, to the given language. */
		public setExtrasLanguage(languageCode: string) {
			this._chapterManager.setLanguage(languageCode);
			this._languageMenu.selectedExtrasLanguage = languageCode;

			if (!this._playerConfig.disableAuthorNotes)
				this._authorNotesManager.setLanguage(languageCode);

			if (!this._playerConfig.disableOverlays)
				this._overlayManager.setLanguage(languageCode);
		}

		/** Sets the subtitle language to the given language. */
		public setSubtitleLanguage(languageCode: string) {
			this._subtitleManager.setLanguage(languageCode);
			this._languageMenu.selectedSubtitleLanguage = languageCode;
		}

		/** Creates the time display popup of the timeline. */
		private setupTimeDisplay() {
			var timeComponent = this._player.controlBar.addChild(new CurrentTimeComponent(this._player));
			$('.vjs-volume-menu-button').after(timeComponent.el());

			this._player.controlBar.progressControl.seekBar.addChild(new MouseTimeDisplayComponent(this._player, this._videoData));
		}

		/** Prepends the given url with the video metadata base url, if configured. */
		private preprendMetadataUrl(url: string): string {
			if (!isAbsoluteUrl(url) && this._playerConfig.videoMetaBaseUrl !== null)
				url = this._playerConfig.videoMetaBaseUrl + '/' + url;

			return url;
		}

		/** Prepends the given url with the video media base url, if configured. */
		private prependMediaUrl(url: string): string {
			if (!isAbsoluteUrl(url) && this._playerConfig.videoMediaBaseUrl !== null)
				url = this._playerConfig.videoMediaBaseUrl + '/' + url;

			return url;
		}

		/** Gets the current videojs player instance. */
		public get player(): VideoJSPlayer {
			return this._player;
		}

		/** Gets the current player configuration settings. */
		public get playerConfig(): PlayerConfig {
			return this._playerConfig;
		}

		/** Gets the current video metadata. */
		public get videoData(): VideoData {
			return this._videoData;
		}
	}
}