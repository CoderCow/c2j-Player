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

			var userPreferredLanguage = normalizeLanguageCode(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || 'de');
			var videojsOptions = <VideoJSOptions>{};
			videojsOptions.defaultVolume = this._userSettings.volume;
			videojsOptions.poster = this.prependMediaUrl(this._videoData.poster);
			videojsOptions.controls = true;
			videojsOptions.fluid = true;
			videojsOptions.playbackRates = [0.5, 1, 1.5, 2, 3];
			if (this._playerConfig.playerLanguage !== null)
				videojsOptions.language = this._playerConfig.playerLanguage;
			else
				videojsOptions.language = userPreferredLanguage;

			if (this._playerConfig.startPlaybackAt !== null || this._playerConfig.autoplay)
				videojsOptions.autoplay = true;

			var manager = this;
			videojs(VideoJSManager.VIDEOJS_ID, videojsOptions, function() {
				var error: Exception = null;
				try {
					manager._player = <VideoJSPlayer>this;

					// Set playback position prior loading media, so no useless buffering will be done.
					if (manager._playerConfig.startPlaybackAt !== null)
						manager._player.currentTime(manager._playerConfig.startPlaybackAt);

					var initialMediaLanguage = (manager._playerConfig.mediaLanguage || userPreferredLanguage);
					var initialAdditionalsLanguage = (manager._playerConfig.additionalsLanguage || userPreferredLanguage);
					if (manager._playerConfig.simpleLanguageSelection)
						initialAdditionalsLanguage = initialMediaLanguage;
					var initialSubtitleLanguage: string = null;
					if (manager._playerConfig.enableSubtitlesByDefault)
						initialSubtitleLanguage = manager._playerConfig.subtitlesLanguage || userPreferredLanguage;
					
					manager.setupButtons(initialMediaLanguage, initialAdditionalsLanguage, initialSubtitleLanguage);

					manager._chapterManager = new ChapterManager(manager._player, manager._videoData, initialAdditionalsLanguage);
					if (!manager._playerConfig.disableAuthorNotes)
						manager._authorNotesManager = new AuthorNotesManager(manager._player, manager._videoData, initialAdditionalsLanguage);

					if (!manager._playerConfig.disableOverlays)
						manager._overlayManager = new OverlayManager(manager._player, manager._videoData, initialAdditionalsLanguage);

					manager._subtitleManager = new SubtitleManager(manager._player, manager, initialSubtitleLanguage);

					manager.setMediaLanguage(initialMediaLanguage);
					manager.setupPanes(initialAdditionalsLanguage);
					manager.setupTimeDisplay();

					// TODO: Remove when VideoJSOptions.defaultVolume works again..
					manager._player.volume(manager._userSettings.volume);
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
		private setupPanes(languageTag: string) {
			var title = this._videoData.titleByLanguage(languageTag);

			this._topPane = new TopPaneComponent(this._player, title);
			this._player.addChild(this._topPane);
		}

		/** Creates additional buttons in the bottom pane. */
		private setupButtons(initialMediaLanguage: string, initialAdditionalsLanguage: string, initialSubtitleLanguage: string) {
			var languageButton = new LanguageButtonComponent(this._player, this._videoData, this._playerConfig.simpleLanguageSelection, initialMediaLanguage, initialAdditionalsLanguage, initialSubtitleLanguage);
			var languageMenu = <LanguageMenuComponent>languageButton.menu;

			languageMenu.on('audioLanguageChanged', () => this.setMediaLanguage(languageMenu.selectedMediaLanguage));
			languageMenu.on('extrasLanguageChanged', () => this.setExtrasLanguage(languageMenu.selectedExtrasLanguage));
			languageMenu.on('subtitleLanguageChanged', () => this.setSubtitleLanguage(languageMenu.selectedSubtitleLanguage));
			this._languageMenu = languageMenu;

			this._player.controlBar.addChild(languageButton);
			$(languageButton.el()).insertBefore('.vjs-fullscreen-control');

			if (this._playerConfig.disallowFullscreen)
				$('.vjs-fullscreen-control').addClass('c2jp-disabled');
		}

		/** Sets the language of the played media to the given language. */
		public setMediaLanguage(languageTag: string) {
			var availableMedia = this._videoData.mediaByLanguage(languageTag);
			availableMedia.sort((m1: MediumData, m2: MediumData) =>
				VideoJSManager.MEDIA_TYPE_PRIORITIES[m1.type] - VideoJSManager.MEDIA_TYPE_PRIORITIES[m2.type]);

			var media: VideoJSSource[] = [];
			availableMedia.forEach((medium: MediumData) => {
				var srcUrl = this.prependMediaUrl(medium.src);
				media.push(<VideoJSSource>{ src: srcUrl, type: medium.type });
			});

			// Setting new source files will reset the playback position, so got to preserve
			// the time first and then start playback again if required.
			var playbackPosition = this.player.currentTime();
			var isPaused = this.player.paused();
			this.player.src(media);

			this.player.currentTime(playbackPosition);
			if (!isPaused)
				this.player.play();

			this._languageMenu.selectedMediaLanguage = languageTag;

			if (this._playerConfig.simpleLanguageSelection)
				this.setExtrasLanguage(languageTag);
		}

		/** Sets the language of all extra content, such as author notes and overlays, to the given language. */
		public setExtrasLanguage(languageTag: string) {
			this._chapterManager.setLanguage(languageTag);
			this._languageMenu.selectedExtrasLanguage = languageTag;

			if (!this._playerConfig.disableAuthorNotes)
				this._authorNotesManager.setLanguage(languageTag);

			if (!this._playerConfig.disableOverlays)
				this._overlayManager.setLanguage(languageTag);
		}

		/** Sets the subtitle language to the given language. */
		public setSubtitleLanguage(languageTag: string) {
			this._subtitleManager.setLanguage(languageTag);
			this._languageMenu.selectedSubtitleLanguage = languageTag;
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