/// <reference path="../VideoData/VideoData.ts" />
/// <reference path="../VideoData/OverlayData.ts" />

module Player {
	'use strict';
	/** Retrieves and reads Camtasia2Json conform video metadata files. */
	export class Camtasia2JsonReader {
		private static COMPATIBLE_FILE_VERSIONS: { [version: string]: boolean } = { '1.1': true };
		private static stringOverlayActionMappings: { [action: string]: OverlayAction } = {
			'none': OverlayAction.None,
			'continue': OverlayAction.ContinueOnClick,
			'goto': OverlayAction.GotoPos,
			'link': OverlayAction.OpenLink
		};
		private static stringVAlignmentMappings: { [alignment: string]: VAlignment } = {
			'center': VAlignment.Center,
			'left': VAlignment.Left,
			'right': VAlignment.Right
		};

		/**
		 * Retrieves the file at the given URL, parses it and calls the given callback function with the resulting VideoData object.
		 * @throws {Exception} When the file could not be retrieved or parsing it has failed.
		 */
		public read(jsonUrl: string, callback: (data: VideoData) => void, errorCallback: (exception: Exception) => void) {
			$.getJSON(jsonUrl).done((jsonObject: any) => {
				var videoData: VideoData;
				try {
					videoData = Camtasia2JsonReader.videoDataFromJson(<ICamtasia2JsonData>jsonObject);
				} catch (e) {
					errorCallback(e);
				}

				callback(videoData);
			}).fail((jqXhr: JQueryXHR, status: string, error: Error) => {
				errorCallback(new Exception(`Retrieving video json metadata has failed with ${status}: ${error}`));
			});
		}

		/** Converts the given Camtasia2Json raw object into a VideoData object. */
		private static videoDataFromJson(jsonData: ICamtasia2JsonData): VideoData {
			if (!Camtasia2JsonReader.COMPATIBLE_FILE_VERSIONS[jsonData.meta.version])
				console.warn(`Video metadata version "${jsonData.meta.version}" is not supported.`);

			var result = new VideoData();
			$.extend(result, jsonData.meta);

			if (jsonData.meta.titles === undefined)
				throw new Exception('"meta.titles" is undefined.');
			result.titles = <LanguageDictionary<string>>{};
			jsonData.meta.titles.forEach((item: any) => result.titles[item.lang] = item.title);

			if (jsonData.meta.descriptions === undefined)
				throw new Exception('"meta.descriptions" is undefined.');
			result.descriptions = <LanguageDictionary<string>>{};
			jsonData.meta.descriptions.forEach((item: any) => result.descriptions[item.lang] = item.description);

			result.media = Camtasia2JsonReader.mediaFromJsonData(jsonData);

			result.captionSettings = Camtasia2JsonReader.captionSettingsFromJsonData(jsonData);
			result.captions = Camtasia2JsonReader.captionsFromJsonData(jsonData);
			result.categories = Camtasia2JsonReader.categoriesFromJsonData(jsonData);
			result.chapters = Camtasia2JsonReader.chaptersFromJsonData(jsonData);
			result.authorNotes = Camtasia2JsonReader.authorNotesFromJsonData(jsonData);

			if (jsonData.overlaySettings === undefined)
				throw new Exception('"overlaySettings" is undefined.');
			result.overlaySettings = $.extend(new OverlaySettingsData(), jsonData.overlaySettings);

			result.overlays = Camtasia2JsonReader.overlaysFromJsonData(jsonData);
			result.authCam = Camtasia2JsonReader.authCamFromJsonData(jsonData);

			return result;
		}

		/**
		 * Converts the media part of the given Camtasia2Json raw object into MediumData objects stored in a language dictionary
		 * with their language tags as keys.
		 */
		private static mediaFromJsonData(jsonData: ICamtasia2JsonData): LanguageDictionary<MediumData[]> {
			if (jsonData.media === undefined)
				throw new Exception('"media" is undefined.');
			if (jsonData.media.digital === undefined)
				throw new Exception('"media.digital" is undefined.');

			var mediaData = <LanguageDictionary<MediumData[]>>{};
			jsonData.media.digital.forEach((item: any) => {
				var mediaDataArray = mediaData[item.lang];
				if (mediaDataArray === undefined)
					mediaData[item.lang] = mediaDataArray = [];

				mediaDataArray.push(<MediumData>$.extend(new MediumData(), item));
			});

			return mediaData;
		};

		/**
		 * Converts the caption settings part of the given Camtasia2Json raw object into a CaptionSettingsData object.
		 */
		private static captionSettingsFromJsonData(jsonData: ICamtasia2JsonData): CaptionSettingsData {
			if (jsonData.captionSettings === undefined)
				throw new Exception('"captionSettings" is undefined.');

			var captionSettingsData = $.extend(new CaptionSettingsData(), jsonData.captionSettings);
			captionSettingsData.alignment = Camtasia2JsonReader.stringVAlignmentMappings[jsonData.captionSettings.alignment.toLowerCase()];

			return captionSettingsData;
		};

		/**
		 * Converts the captions part of the given Camtasia2Json raw object into CaptionData objects stored in a language dictionary
		 * with their language tags as keys.
		 */
		private static captionsFromJsonData(jsonData: ICamtasia2JsonData): LanguageDictionary<CaptionData[]> {
			if (jsonData.captions === undefined)
				throw new Exception('"captions" is undefined.');

			var captionsData = <LanguageDictionary<CaptionData[]>>{};
			jsonData.captions.forEach((item: any) => {
				var captionDataArray = captionsData[item.lang];
				if (captionDataArray === undefined)
					captionsData[item.lang] = captionDataArray = [];

				var captionData = <CaptionData>$.extend(new CaptionData(), item);
				captionData.end = captionData.begin + captionData.dur;

				captionDataArray.push(captionData);
			});

			return captionsData;
		};

		/**
		 * Converts the categories part of the given Camtasia2Json raw object into CategoryData objects stored in a language
		 * dictionary with their language tags as keys.
		 */
		private static categoriesFromJsonData(jsonData: ICamtasia2JsonData): LanguageDictionary<CategoryData[]> {
			if (jsonData.categories === undefined)
				throw new Exception('"categories" is undefined.');

			var categoriesData = <LanguageDictionary<CategoryData[]>>{};
			jsonData.categories.forEach((item: any) => {
				var categoryDataArray = categoriesData[item.lang];
				if (categoryDataArray === undefined)
					categoriesData[item.lang] = categoryDataArray = [];

				var categoryData = <CategoryData>$.extend(new CategoryData(), item);
				categoryData.end = categoryData.begin + categoryData.dur;

				categoryDataArray.push(categoryData);
			});

			return categoriesData;
		};

		/**
		 * Converts the author notes part of the given Camtasia2Json raw object into AuthorNoteData objects stored in a language
		 * dictionary with their language tags as keys.
		 */
		private static authorNotesFromJsonData(jsonData: ICamtasia2JsonData): LanguageDictionary<AuthorNoteData[]> {
			if (jsonData.authorNotes === undefined)
				throw new Exception('"authorNotes" is undefined.');

			var authorNotesData = <LanguageDictionary<AuthorNoteData[]>>{};
			jsonData.authorNotes.forEach((item: any) => {
				var authorDataArray = authorNotesData[item.lang];
				if (authorDataArray === undefined)
					authorNotesData[item.lang] = authorDataArray = [];

				var authorNoteData = <AuthorNoteData>$.extend(new AuthorNoteData(), item);
				if (item.dur === undefined)
					authorNoteData.dur = 0;

				authorNoteData.end = authorNoteData.begin + authorNoteData.dur;
				authorDataArray.push(authorNoteData);
			});

			return authorNotesData;
		};

		/**
		 * Converts the chapters part of the given Camtasia2Json raw object into ChapterData objects stored in a language dictionary
		 * with their language tags as keys.
		 */
		private static chaptersFromJsonData(jsonData: ICamtasia2JsonData): LanguageDictionary<ChapterData[]> {
			if (jsonData.chapters === undefined)
				throw new Exception('"chapters" is undefined.');

			var chaptersData = <LanguageDictionary<ChapterData[]>>{};
			jsonData.chapters.forEach((item: any) => {
				var chapterDataArray = chaptersData[item.lang];
				if (chapterDataArray === undefined)
					chaptersData[item.lang] = chapterDataArray = [];

				var chapterData = <ChapterData>$.extend(new ChapterData(), item);

				if (item.additionals === undefined)
					throw new Exception(`"additionals" of chapter "${item.id}" is undefined.`);

				chapterData.end = chapterData.begin + chapterData.dur;
				chapterData.additionals = [];
				var additionalsData = item.additionals;
				for (var i = 0; i < additionalsData.length; i++) {
					var additionalData = additionalsData[i];
					chapterData.additionals[i] = $.extend(new ChapterAdditionalData(), additionalData);

					for (var i2 = 0; i2 < additionalData.links.length; i2++)
						chapterData.additionals[i].links[i2] = $.extend(new LinkData(), additionalData.links[i2]);
				}
				item.additionals.forEach((item: any) => chapterData.additionals[item.lang] = $.extend(new CategoryData(), item));

				chapterDataArray.push(chapterData);
			});

			return chaptersData;
		};

		/**
		 * Converts the overlays part of the given Camtasia2Json raw object into OverlayData objects stored in a language dictionary
		 * with their language tags as keys.
		 */
		private static overlaysFromJsonData(jsonData: ICamtasia2JsonData): LanguageDictionary<OverlayData[]> {
			if (jsonData.overlays === undefined)
				throw new Exception('"overlays" is undefined.');

			var overlaysData = <LanguageDictionary<OverlayData[]>>{};
			jsonData.overlays.forEach((item: any) => {
				var overlayDataArray = overlaysData[item.lang];
				if (overlayDataArray === undefined)
					overlaysData[item.lang] = overlayDataArray = [];

				var overlayData = <OverlayData>$.extend(new OverlayData(), item);
				overlayData.action = Camtasia2JsonReader.stringOverlayActionMappings[item.action.toLowerCase()];
				if (overlayData.action === OverlayAction.OpenLink)
					overlayData.actionParams = $.extend(new LinkActionParamsData(), item.actionParams);
				else if (overlayData.action === OverlayAction.GotoPos)
					overlayData.actionParams = $.extend(new GotoActionParamsData(), item.actionParams);
				else
					overlayData.actionParams = null;

				if (item.dur === undefined)
					overlayData.dur = 0;
				overlayData.end = overlayData.begin + overlayData.dur;
				overlayData.translateTransform = Camtasia2JsonReader.vector3FromJsonArray(item.translateTransform);
				overlayData.rotateTransform = Camtasia2JsonReader.vector3FromJsonArray(item.rotateTransform);
				overlayData.shearTransform = Camtasia2JsonReader.vector3FromJsonArray(item.shearTransform);

				overlayDataArray.push(overlayData);
			});

			return overlaysData;
		};

		/**
		 * Converts the author cam part of the given Camtasia2Json raw object into AuthCamData objects stored in a language dictionary
		 * with their language tags as keys.
		 */
		private static authCamFromJsonData(jsonData: ICamtasia2JsonData): AuthCamData {
			if (jsonData.authCam === undefined)
				return null;

			var authCamData = <AuthCamData>$.extend(new AuthCamData(), jsonData.authCam);
			authCamData.end = authCamData.begin + authCamData.dur;
			authCamData.translateTransform = Camtasia2JsonReader.vector3FromJsonArray(jsonData.authCam.translateTransform);
			authCamData.rotateTransform = Camtasia2JsonReader.vector3FromJsonArray(jsonData.authCam.rotateTransform);
			authCamData.shearTransform = Camtasia2JsonReader.vector3FromJsonArray(jsonData.authCam.shearTransform);

			authCamData.media = <LanguageDictionary<MediumData[]>>{};
			jsonData.authCam.media.forEach((item: any) => {
				var mediaDataArray = authCamData.media[item.lang];
				if (mediaDataArray === undefined)
					authCamData.media[item.lang] = mediaDataArray = [];

				mediaDataArray.push($.extend(new MediumData(), item));
			});

			return authCamData;
		};

		/** Creates a Vector3 object from the given array of 3 numbers. */
		private static vector3FromJsonArray(jsonArray: number[]): Vector3 {
			return new Vector3(jsonArray[0], jsonArray[1], jsonArray[2]);
		}

		/** Creates the function notation of a CSS rgba color from the given array of 4 numbers. */
		private static cssColorFromJsonArray(jsonArray: number[]): string {
			return 'rgba({0}, {1}, {2}, {3})'.format(jsonArray);
		}
	}
}