import { OverlayData } from './OverlayData';
import { AuthCamData } from './AuthCamData';
import { OverlaySettingsData } from './OverlaySettingsData';
import { ChapterData } from './ChapterData';
import { CategoryData } from './CategoryData';
import { CaptionData } from './CaptionData';
import { CaptionSettingsData } from './CaptionSettingsData';
import { AuthorNoteData } from './AuthorNoteData';
import { MediumData } from './MediumData';
import { IValidatable } from './../../Utils/IValidatable';
import { Validate } from './../../Utils/Validate';

/**
 * Represents the video metadata.
 */
export class VideoData implements IValidatable {
	/** The duration of the video in seconds. */
	public dur: number;
	public author: string;
	/** The production date of the video. */
	public date: Date;
	public defaultLang: string;
	public contact: string;
	public socialShareUrl: string;
	public enableSocialShareButtons: boolean;
	public tags: string;
	/** Url to the video's poster image. */
	public poster: string;
	public titles: LanguageDictionary<string>;
	public descriptions: LanguageDictionary<string>;
	public media: LanguageDictionary<MediumData[]>;
	public authorNotes: LanguageDictionary<AuthorNoteData[]>;
	public captionSettings: CaptionSettingsData;
	public captions: LanguageDictionary<CaptionData[]>;
	public categories: LanguageDictionary<CategoryData[]>;
	public chapters: LanguageDictionary<ChapterData[]>;
	public overlaySettings: OverlaySettingsData;
	public overlays: LanguageDictionary<OverlayData[]>;
	public authCam?: AuthCamData;

	/** @inheritdoc */
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
		Validate.value(this.authCam, 'authCam', false, true);
		if (this.authCam !== undefined)
			Validate.validatable(this.authCam, 'authCam');
	}

	public titleByLanguage(languageTag: string): string {
		return this.getByLanguage(this.titles, languageTag);
	}

	public descriptionByLanguage(languageTag: string): string {
		return this.getByLanguage(this.descriptions, languageTag);
	}

	public mediaByLanguage(languageTag: string): MediumData[] {
		return this.getByLanguage(this.media, languageTag);
	}

	public authorNotesByLanguage(languageTag: string): AuthorNoteData[] {
		return this.getByLanguage(this.authorNotes, languageTag);
	}

	public captionsByLanguage(languageTag: string): CaptionData[] {
		return this.getByLanguage(this.captions, languageTag);
	}

	public categoriesByLanguage(languageTag: string): CategoryData[] {
		return this.getByLanguage(this.categories, languageTag);
	}

	public chaptersByLanguage(languageTag: string): ChapterData[] {
		return this.getByLanguage(this.chapters, languageTag);
	}

	public overlaysByLanguage(languageTag: string): OverlayData[] {
		return this.getByLanguage(this.overlays, languageTag);
	}

	/**
	 * Gets a value from a language dictionary using the given IETF language tag.
	 * If "en-US" is given and there's not such language code present in the dictionary, "en" (the first subtag of the language tag)
	 * will be used as a fallback. If neither "en-US" nor "en" is available, an object deposited with the default language is retrieved.
	 * @throws When no object by the given language tag was found and if the object isn't available in the default language either.
	 */
	private getByLanguage<T>(languageIndexedObject: LanguageDictionary<T>, languageTag: string): T {
		var items = languageIndexedObject[languageTag];
		if (items === undefined) {
			// There might not be data for 'en-us' available, but maybe for 'en' at least.
			var firstSubtag = languageTag.substr(0, 2);
			items = languageIndexedObject[firstSubtag];
		}
		if (items === undefined)
			items = languageIndexedObject[this.defaultLang];
		if (items === undefined)
			console.error(`Metadata records for default language \"${languageTag}\" expected but not found.`);

		return items;
	}
}
