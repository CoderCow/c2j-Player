module Player {
	'use strict';
	/**
	 * A menu for language selection of media, additional content and subtitles.
	 *
	 * @event audioLanguageChanged
	 * @event extrasLanguageChanged
	 * @event subtitleLanguageChanged
	 */
	export class LanguageMenuComponent extends VideoJSMenu {
		private static NONE_SELECTABLE_CODE = 'none';

		private _selectedMediaLanguage: string;
		private _selectedExtrasLanguage: string;
		private _selectedSubtitleLanguage: string;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, options: ILanguageMenuComponentOptions) {
			options.initialSubtitleLanguage = options.initialSubtitleLanguage || 'none';

			super(player, { cjOptions: options });

			this.setSelected('audio', options.initialMediaLanguage);
			this._selectedMediaLanguage = options.initialMediaLanguage;
			this.setSelected('extras', options.initialAdditionalsLanguage);
			this._selectedExtrasLanguage = options.initialAdditionalsLanguage;
			this.setSelected('subtitle', options.initialSubtitleLanguage);
			this._selectedSubtitleLanguage = options.initialSubtitleLanguage;
		}

		/** @inheritdoc */
		public createEl() {
			var languageTagTable: ILanguageTagDictionary = __getLanguageTagTable();
			var audioSelectables = this.availableAudioLanguages(languageTagTable);
			var extraSelectables = this.availableExtraLanguages(languageTagTable);
			var subtitleSelectables = this.availableSubtitleLanguage(languageTagTable);

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
				isSimpleMenuMode: this.cjOptions().isSimpleMenuMode
			}));

			menu.find('.audio select').change((event: Event) => {
				this._selectedMediaLanguage = $(event.target).val();
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

		/** Gets the IETF language tag of the currently selected audio language. */
		public get selectedMediaLanguage(): string {
			return this._selectedMediaLanguage;
		}

		/** Sets the currently selected audio language by using the given IETF language tag. */
		public set selectedMediaLanguage(languageTag: string) {
			if (languageTag !== this._selectedMediaLanguage) {
				this.setSelected('audio', languageTag);
				this._selectedMediaLanguage = languageTag;

				this.trigger('audioLanguageChanged');
			}
		}

		/** Gets the IETF language tag of the currently selected language for additional content. */
		public get selectedExtrasLanguage(): string {
			return this._selectedExtrasLanguage;
		}

		/** Sets the currently selected language for additional content by using the given IETF language tag. */
		public set selectedExtrasLanguage(languageTag: string) {
			if (languageTag !== this._selectedExtrasLanguage) {
				this.setSelected('extras', languageTag);
				this._selectedExtrasLanguage = languageTag;

				this.trigger('extrasLanguageChanged');
			}
		}

		/** Gets the IETF language tag of the currently selected subtitle language. */
		public get selectedSubtitleLanguage(): string {
			return this._selectedSubtitleLanguage;
		}

		/** Sets the currently selected subtitle language by using the given IETF language tag. */
		public set selectedSubtitleLanguage(languageTag: string) {
			if (languageTag !== this._selectedSubtitleLanguage) {
				this.setSelected('subtitle', languageTag);
				this._selectedSubtitleLanguage = languageTag;

				this.trigger('subtitleLanguageChanged');
			}
		}

		/** Sets the selected item of a html list with the given class name. */
		private setSelected(primaryClassName: string, languageTag: string) {
			$(this.el()).find(`.${primaryClassName} .multi.value`).val(languageTag);
		}

		/** Gets the available audio items with the language tags and language names to be used as labels. */
		private availableAudioLanguages(languageTagTable: ILanguageTagDictionary): { languageTag: string, label: string }[] {
			var audioSelectables: { languageTag: string, label: string }[] = [];

			$.each(this.cjOptions().videoData.media, (languageTag: string, medium: MediumData) =>
				audioSelectables.push({ languageTag: languageTag, label: this.languageNameFromTag(languageTagTable, languageTag) }));

			return audioSelectables;
		}

		/** Gets the available additional items with the language tags and language names to be used as labels. */
		private availableExtraLanguages(languageTagTable: ILanguageTagDictionary): { languageTag: string, label: string }[] {
			var extraSelectables: { languageTag: string, label: string }[] = [];

			// TODO: add categories when it is time
			let videoData = this.cjOptions().videoData;
			var extraDataLanguages = LanguageMenuComponent.distinctLanguagesFromDataSets(videoData.chapters, videoData.authorNotes, videoData.overlays);
			$.each(extraDataLanguages, (languageTag: string) =>
				extraSelectables.push({ languageTag: languageTag, label: this.languageNameFromTag(languageTagTable, languageTag) }));

			if (extraSelectables.length === 0)
				extraSelectables.push({ languageTag: LanguageMenuComponent.NONE_SELECTABLE_CODE, label: this.localize('none') });

			return extraSelectables;
		}

		/** Gets the available subtitle items with the language tags and language names to be used as labels. */
		private availableSubtitleLanguage(languageTagTable: ILanguageTagDictionary): { languageTag: string, label: string }[] {
			var subtitleSelectables: { languageTag: string, label: string }[] = [];

			subtitleSelectables.push({ languageTag: LanguageMenuComponent.NONE_SELECTABLE_CODE, label: this.localize('none') });
			$.each(this.cjOptions().videoData.captions, (languageTag: string) =>
				subtitleSelectables.push({ languageTag: languageTag, label: this.languageNameFromTag(languageTagTable, languageTag) }));

			// Use this code to resolve subtitle tracks from the current video.js tech. This will probably be required when YouTube should be supported int he future.
			/*var tracks = this.player_.textTracks();
			for (var i = 0; i < tracks.length; i++) {
				var track = tracks[i];

				if (track.kind === 'captions')
					availableSubtitleLanguage.push({ code: this.languageNameFromTag(languageTagTable, track.language), label: track.label });
			}*/

			return subtitleSelectables;
		}

		/** Gets a distinct set of language tags by the given language dictionaries. */
		private static distinctLanguagesFromDataSets(...dictionaries: LanguageDictionary<any>[]): { [languageTag: string]: boolean } {
			var resultingSet: { [code: string]: boolean } = {};
			dictionaries.forEach((dictionary: {}) => {
				// For every language tag in the dictionary
				$.each(dictionary, (languageTag: string) => {
					if (resultingSet[languageTag] === undefined)
						resultingSet[languageTag] = true;
				});
			});

			return resultingSet;
		}

		/** Gets the localized language name from the given table by the given tag. */
		private languageNameFromTag(languageTagTable: any, languageTag: string): string {
			var languageName = languageTagTable[languageTag.toLowerCase()];
			if (languageName !== undefined) {
				languageName = this.localize(languageName) + ' (' + languageName + ')';
			} else {
				console.warn(`Language code ${languageTag} could not be resolved into a language name.`);
				languageName = languageTag;
			}

			return languageName;
		}

		public cjOptions(): ILanguageMenuComponentOptions {
			return super.options().cjOptions;
		}
	}
}

videojs.registerComponent('LanguageMenuComponent', Player.LanguageMenuComponent);
