module Player {
	'use strict';
	export class LanguageMenuComponent extends VideoJSMenu {
		private static NONE_SELECTABLE_CODE = 'none';

		private _videoData: VideoData;
		private _selectedAudioLanguage: string;
		private _selectedExtrasLanguage: string;
		private _selectedSubtitleLanguage: string;

		public constructor(player: VideoJSPlayer, videoData: VideoData) {
			this._videoData = videoData;

			super(player, {});
		}

		public createEl() {
			var languageCodeTable: LanguageCodeTable = __getLanguageCodeTable();
			var audioSelectables = this.audioSelectables(languageCodeTable);
			var extraSelectables = this.extraSelectables(languageCodeTable);
			var subtitleSelectables = this.subtitleSelectables(languageCodeTable);

			var menu = $(TemplateUtils.renderSynch('Components/Menus/LanguageMenu', {
				title: this.localize('Language'),
				noOtherLanguagesAvailableHint: this.localize('No other languages available.'),
				audio: {
					label: this.localize("Audio / Video"),
					isJustOne: audioSelectables.length === 1,
					selectables: audioSelectables,
				},
				extras: {
					label: this.localize("Extras"),
					isJustOne: extraSelectables.length === 1,
					selectables: extraSelectables,
				},
				subtitle: {
					label: this.localize("Subtitles"),
					isJustOne: subtitleSelectables.length === 1,
					selectables: subtitleSelectables,
				},
			}));

			menu.find('.audio select').change((event: Event) => {
				this._selectedAudioLanguage = $(event.target).val();
				this.trigger('audioLanguageChanged');
			});
			menu.find('.extras select').change((event: Event) => {
				this._selectedExtrasLanguage = $(event.target).val();
				this.trigger('extrasLanguageChanged');
			});
			menu.find('.subtitle select').change((event: Event) => {
				this._selectedSubtitleLanguage = $(event.target).val();
				this.trigger('subtitleLanguageChanged');
			});

			return menu[0];
		}

		public get selectedAudioLanguage(): string {
			return this._selectedAudioLanguage;
		}

		public set selectedAudioLanguage(languageCode: string) {
			if (languageCode !== this._selectedAudioLanguage) {
				this.setSelected('audio', languageCode);
				this._selectedAudioLanguage = languageCode;

				this.trigger('audioLanguageChanged');
			}
		}

		public get selectedExtrasLanguage(): string {
			return this._selectedExtrasLanguage;
		}

		public set selectedExtrasLanguage(languageCode: string) {
			if (languageCode !== this._selectedExtrasLanguage) {
				this.setSelected('extras', languageCode);
				this._selectedExtrasLanguage = languageCode;

				this.trigger('extrasLanguageChanged');
			}
		}

		public get selectedSubtitleLanguage(): string {
			return this._selectedSubtitleLanguage;
		}

		public set selectedSubtitleLanguage(languageCode: string) {
			if (languageCode !== this._selectedSubtitleLanguage) {
				this.setSelected('subtitle', languageCode);
				this._selectedSubtitleLanguage = languageCode;

				this.trigger('subtitleLanguageChanged');
			}
		}

		private setSelected(primaryClassName: string, languageCode: string) {
			$(this.el()).find(`.${primaryClassName} .multi.value`).val(languageCode);
		}

		private audioSelectables(languageCodeTable: LanguageCodeTable): { code: string, label: string }[] {
			var audioSelectables: { code: string, label: string }[] = [];

			$.each(this._videoData.media, (languageCode: string, medium: MediumData) =>
				audioSelectables.push({ code: languageCode, label: this.languageNameFromCode(languageCodeTable, languageCode) }));

			return audioSelectables;
		}

		private extraSelectables(languageCodeTable: LanguageCodeTable): { code: string, label: string }[] {
			var extraSelectables: { code: string, label: string }[] = [];

			// TODO: add categories when it is time
			var extraDataLanguages = LanguageMenuComponent.oneFromManyFromManyLanguageSets(this._videoData.chapters, this._videoData.authorNotes, this._videoData.overlays);
			$.each(extraDataLanguages, (languageCode: string) =>
				extraSelectables.push({ code: languageCode, label: this.languageNameFromCode(languageCodeTable, languageCode) }));

			if (extraSelectables.length === 0)
				extraSelectables.push({ code: LanguageMenuComponent.NONE_SELECTABLE_CODE, label: this.localize('none') });

			return extraSelectables;
		}

		private subtitleSelectables(languageCodeTable: LanguageCodeTable): { code: string, label: string }[] {
			var subtitleSelectables: { code: string, label: string }[] = [];

			subtitleSelectables.push({ code: LanguageMenuComponent.NONE_SELECTABLE_CODE, label: this.localize('none') });
			$.each(this._videoData.captions, (languageCode: string) =>
				subtitleSelectables.push({ code: languageCode, label: this.languageNameFromCode(languageCodeTable, languageCode) }));

			// Use this code to resolve subtitle tracks from the current video.js tech. This will probably be required when YouTube should be supported int he future.
			/*
			var tracks = this.player_.textTracks();
			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];

				if (track.kind === 'captions')
					subtitleSelectables.push({ code: this.languageNameFromCode(languageCodeTable, track.language), label: track.label });
			}*/

			return subtitleSelectables;
		}

		private static oneFromManyFromManyLanguageSets(...sets: {}[]): {} {
			var resultingSet: { [code: string]: boolean } = {};
			sets.forEach((set: {}) => {
				$.each(set, (languageCode: string) => {
					if (resultingSet[languageCode] === undefined)
						resultingSet[languageCode] = true;
				});
			});

			return resultingSet;
		}

		private languageNameFromCode(languageCodeTable: any, languageCode: string): string {
			var languageName = languageCodeTable[languageCode.toLowerCase()];
			if (languageName !== undefined) {
				languageName = this.localize(languageName) + ' (' + languageName + ')';
			} else {
				console.warn(`Language code ${languageCode} could not be resolved into a language name.`);
				languageName = languageCode;
			}

			return languageName;
		}
	}
}

videojs.registerComponent('LanguageMenuComponent', Player.LanguageMenuComponent);
