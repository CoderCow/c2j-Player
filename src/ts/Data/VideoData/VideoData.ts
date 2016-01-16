module Player {
	export type LanguageIndexed<T> = { [language: string]: T };

	'use strict';
	export class VideoData implements Validatable {
		public dur: number;
		public author: string;
		public date: Date;
		public defaultLang: string;
		public contact: string;
		public socialShareUrl: string;
		public enableSocialShareButtons: boolean;
		public tags: string;
		public poster: string;
		public titles: LanguageIndexed<string>;
		public descriptions: LanguageIndexed<string>;
		public media: LanguageIndexed<MediumData>;
		public authorNotes: LanguageIndexed<AuthorNoteData>;
		public captionSettings: CaptionSettingsData;
		public captions: LanguageIndexed<CaptionData>;
		public categories: LanguageIndexed<CategoryData>;
		public chapters: LanguageIndexed<ChapterData>;
		public overlaySettings: OverlaySettingsData;
		public overlays: LanguageIndexed<OverlayData>;
		public authCam: AuthCamData;

		public invalidate(): void {
			Validate.number(this.dur, 'dur', 0);
			Validate.string(this.author, 'author');
			Validate.value(this.date, 'date');
			Validate.languageCode(this.defaultLang, 'defaultLang');
			Validate.string(this.contact, 'contact');
			Validate.string(this.socialShareUrl, 'socialShareUrl');
			Validate.value(this.enableSocialShareButtons, 'enableSocialShareButtons');
			Validate.string(this.tags, 'tags');
			Validate.string(this.poster, 'poster');

			Validate.languageIndexedItems(this.titles, 'titles', (language: string, title: string) => {
				Validate.string(title, 'title');
			});
			Validate.languageIndexedItems(this.descriptions, 'descriptions', (language: string, description: string) => {
				Validate.string(description, 'description');
			});
			Validate.value(this.media, 'media');
			Validate.languageIndexedValidatables(this.media, 'media');
			Validate.value(this.authorNotes, 'authorNotes');
			Validate.languageIndexedValidatables(this.authorNotes, 'authorNotes');
			Validate.value(this.captionSettings, 'captionSettings');
			Validate.validatable(this.captionSettings, 'captionSettings');
			Validate.value(this.captions, 'captions');
			Validate.languageIndexedValidatables(this.captions, 'captions');
			Validate.value(this.categories, 'categories');
			Validate.languageIndexedValidatables(this.categories, 'categories');
			Validate.value(this.chapters, 'chapters');
			Validate.languageIndexedValidatables(this.chapters, 'chapters');
			Validate.value(this.overlaySettings, 'overlaySettings');
			Validate.validatable(this.overlaySettings, 'overlaySettings');
			Validate.value(this.overlays, 'overlays');
			Validate.languageIndexedValidatables(this.overlays, 'overlays');
			Validate.value(this.authCam, 'authCam');
			Validate.validatable(this.authCam, 'authCam');
		}
	}
}