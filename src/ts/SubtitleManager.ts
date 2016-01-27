module Player {
	'use strict';
	export class SubtitleManager {
		private _player: VideoJSPlayer;
		private _videoData: VideoData;

		public constructor(player: VideoJSPlayer, videoData: VideoData, initialLanguage: string) {
			this._player = player;
			this._videoData = videoData;

			var languageCodeTable = __getLanguageCodeTable();
			this.setupSubtitleSettings();

			$.each(this._videoData.captions, (languageCode: string, captions: CaptionData[]) => {
				// Sort captions by their beginning time.
				captions.sort((a: CaptionData, b: CaptionData) => a.begin - b.begin);

				var languageName = languageCodeTable[languageCode.toLowerCase()];
				if (languageName !== undefined) {
					languageName = this._player.localize(languageName) + ' (' + languageName + ')';
				} else {
					console.warn(`Language code ${languageCode} could not be resolved into a language name.`);
					languageName = languageCode;
				}

				var textTrack = <VideoJSTextTrack>this._player.addTextTrack('captions', languageName, languageCode);

				captions.forEach((caption: CaptionData) =>
					textTrack.addCue(new VTTCue(caption.begin, caption.end, caption.content)));
			});
		}

		public setLanguage(languageCode: string) {
			var tracks = this._player.textTracks();

			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];

				if (track.kind === 'captions') {
					if (track.language === languageCode)
						track.mode = 'showing';
					else
						track.mode = 'disabled';
				}
			}
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
	}
}