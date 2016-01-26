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
		private _noteMarkers: SeekBarNotesMarkerComponent[];
		private _overlayManager: OverlayManager;

		public constructor(userSettings: UserSettings, videoData: VideoData) {
			this._userSettings = userSettings;
			this._videoData = videoData;
			this._noteMarkers = [];
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

				_this.setupPanes();
				_this.setupTimeDisplay();
				_this.setVideoLanguage(_this._videoData.defaultLang);
				_this.setupSubtitles();

				initCompleted();
			});
		}

		public setVideoLanguage(languageCode: string) {
			var availableMedia = this._videoData.media[languageCode];
			availableMedia.sort((m1: MediumData, m2: MediumData) =>
				VideoJSManager.MEDIA_TYPE_PRIORITIES[m1.type] - VideoJSManager.MEDIA_TYPE_PRIORITIES[m2.type]);

			var media: VideoJSSource[] = [];
			availableMedia.forEach((medium: MediumData) =>
				media.push(<VideoJSSource>{ src: App.VIDEO_BASE_PATH + medium.src, type: medium.type }));

			this.player.src(media);

			this.setupChapters(languageCode);
			this.setupAuthorNotes(languageCode);
			this.setupOverlays(languageCode);
		}

		private setupPanes() {
			this._player.addChild(new TopPaneComponent(this._player, this._videoData.titles[this._videoData.defaultLang]));
		}

		private setupTimeDisplay() {
			var timeComponent = this._player.controlBar.addChild(new CurrentTimeComponent(this._player));
			$('.vjs-volume-menu-button').after(timeComponent.el());

			this._player.controlBar.progressControl.seekBar.addChild(new MouseTimeDisplayComponent(this._player, this._videoData));
		}

		private setupChapters(languageCode: string) {
			var chapters = this._videoData.chapters[languageCode];
			chapters.sort((c1: ChapterData, c2: ChapterData) => c1.begin - c2.begin);

			// note: excluding the first chapter
			for (var i = 1; i < chapters.length; i++) {
				this._player.controlBar.progressControl.seekBar.addChild(new SeekBarChapterMarkerComponent(this._player, this._videoData, chapters[i]));
			}

			// Uncomment to enable the video.js chapter menu (which seems buggy atm)
			//var textTrack = <VideoJSTextTrack>this.player.addTextTrack('chapters', 'chapters: ' + languageCode, languageCode);

			/*chapterData.forEach((chapter: ChapterData) => {
				var cue = new VTTCue(chapter.begin, chapter.end, chapter.title);
				textTrack.addCue(cue);
			});*/
		};

		private setupAuthorNotes(languageCode: string) {
			var authorNotes = this._videoData.authorNotes[languageCode];

			authorNotes.forEach((authorNote: AuthorNoteData) => this.setupAuthorNote(authorNote));
		}

		private setupAuthorNote(authorNote: AuthorNoteData) {
			if (authorNote.displayInTimeline) {
				var existingMarkerAtAboutTheSamePosition = this._noteMarkers.firstOrUndefined((existingMarker: SeekBarNotesMarkerComponent) =>
					(authorNote.begin >= existingMarker.time - 4 && authorNote.end <= existingMarker.time + 4));

				if (existingMarkerAtAboutTheSamePosition !== undefined) {
					existingMarkerAtAboutTheSamePosition.addNote(authorNote);
				} else {
					var noteMarkerComponent = new SeekBarNotesMarkerComponent(this._player, this._videoData, authorNote);
					this._noteMarkers.push(noteMarkerComponent);

					this._player.controlBar.progressControl.seekBar.addChild(noteMarkerComponent);
				}
			}
		}

		public addAuthorNote(authorNote: AuthorNoteData) {
			this._videoData.authorNotes[authorNote.lang].push(authorNote);
			this.setupAuthorNote(authorNote);
		}

		private setupSubtitles() {
			var languageCodeTable = __getLanguageCodeTable();
			this.setupSubtitleSettings();

			$.each(this._videoData.captions, (languageCode: string, captions: CaptionData[]) => {
				var languageName = languageCodeTable[languageCode.toLowerCase()];
				if (languageName !== undefined) {
					languageName = this._player.localize(languageName) + ' (' + languageName + ')';
				} else {
					console.warn(`Language code ${languageCode} could not be resolved into a language name.`);
					languageName = languageCode;
				}

				var textTrack = <VideoJSTextTrack>this.player.addTextTrack('captions', languageName, languageCode);

				captions.forEach((caption: CaptionData) => {
					var cue = new VTTCue(caption.begin, caption.end, caption.content);
					textTrack.addCue(cue);
				});
			});
		}

		private setupOverlays(languageCode: string) {
			$.each(this._videoData.overlays, (language: string, overlays: OverlayData[]) =>
				overlays.sort((a: OverlayData, b: OverlayData) => a.begin - b.begin));

			this._overlayManager = new OverlayManager(this._player, this._videoData, languageCode);
		}

		// TODO: rewrite textTrackSettings and textTrackDisplay components for proper subtitle display
		private setupSubtitleSettings() {
			var textTrackSettings = <VideoJSTextTrackSettings>{};
			var c2jCaptionSettings = this._videoData.captionSettings;

			var color = c2jCaptionSettings.foregroundColor;
			textTrackSettings.color = [0, color[0], color[1], color[2]];

			color = c2jCaptionSettings.backgroundColor;
			textTrackSettings.backgroundColor = [0, color[0], color[1], color[2]];

			textTrackSettings.fontFamily = c2jCaptionSettings.fontName;
			textTrackSettings.textOpacity = 1;
			textTrackSettings.windowOpacity = 0;
			textTrackSettings.fontPercent = 1;
			textTrackSettings.windowColor = [0, 0, 0, 0];

			if (this._videoData.captionSettings.isBackgroundEnabled)
				textTrackSettings.backgroundOpacity = c2jCaptionSettings.opacity;
			else
				textTrackSettings.backgroundOpacity = 0;

			var videoJsTextTrackSettingsComponent = <any>this._player.getChild('textTrackSettings');
			videoJsTextTrackSettingsComponent.getValues = () => {
				return textTrackSettings;
			};
			var videoJsTextTrackDisplayComponent = <any>this._player.getChild('textTrackDisplay');
			videoJsTextTrackDisplayComponent.updateDisplay();
		};

		public get player(): VideoJSPlayer {
			return this._player;
		}
	}
}