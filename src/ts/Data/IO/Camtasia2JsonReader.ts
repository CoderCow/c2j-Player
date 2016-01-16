/// <reference path="../../Utils/Lazy.ts" />

module Player {
	'use strict';
	export class Camtasia2JsonReader {
		private static COMPATIBLE_FILE_VERSIONS: { [version: string]: boolean } = { '1.1': true };
		private static stringOverlayActionMappings = new Lazy<{ [action: string]: OverlayAction }>(() => {
			return {
				'none': OverlayAction.None,
				'continue': OverlayAction.ContinueOnClick,
				'goto': OverlayAction.GotoPos,
				'link': OverlayAction.OpenLink
			};
		});
		private static stringVAlignmentMappings = new Lazy<{ [alignment: string]: VAlignment }>(() => {
			return {
				'center': VAlignment.Center,
				'left': VAlignment.Left,
				'right': VAlignment.Right
			};
		});

		public read(jsonUrl: string, callback: (data: VideoData) => void, errorCallback: (exception: Exception) => void) {
			$.getJSON(jsonUrl).done((jsonObject: any) => {
				var videoData: VideoData;
				try {
					videoData = Camtasia2JsonReader.videoDataFromJson(<Camtasia2JsonObject>jsonObject);
				} catch (e) {
					errorCallback(e);
				}

				callback(videoData);
			}).fail((jqXhr: JQueryXHR, status: string, error: Error) => {
				errorCallback(new Exception(`Retrieving video json metadata has failed with ${status}: ${error}`));
			});
		}

		private static videoDataFromJson(jsonData: Camtasia2JsonObject): VideoData {
			if (!Camtasia2JsonReader.COMPATIBLE_FILE_VERSIONS[jsonData.meta.version])
				console.warn(`Video metadata version "${jsonData.meta.version}" is not supported.`);

			var result = new VideoData();
			$.extend(result, jsonData.meta);

			if (jsonData.meta.titles === undefined)
				throw new Exception('"meta.titles" is undefined.');
			result.titles = <LanguageIndexed<string>>{};
			jsonData.meta.titles.forEach((item: any) => result.titles[item.lang] = item.title);

			if (jsonData.meta.descriptions === undefined)
				throw new Exception('"meta.descriptions" is undefined.');
			result.descriptions = <LanguageIndexed<string>>{};
			jsonData.meta.descriptions.forEach((item: any) => result.descriptions[item.lang] = item.description);

			if (jsonData.media === undefined)
				throw new Exception('"media" is undefined.');
			if (jsonData.media.digital === undefined)
				throw new Exception('"media.digital" is undefined.');
			result.media = <LanguageIndexed<MediumData>>{};
			jsonData.media.digital.forEach((item: any) => result.media[item.lang] = $.extend(new MediumData(), item));

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

		private static captionSettingsFromJsonData(jsonData: Camtasia2JsonObject): CaptionSettingsData {
			if (jsonData.captionSettings === undefined)
				throw new Exception('"captionSettings" is undefined.');

			var captionSettingsData = $.extend(new CaptionSettingsData(), jsonData.captionSettings);
			captionSettingsData.backgroundColor = Camtasia2JsonReader.cssColorFromJsonArray(jsonData.captionSettings.backgroundColor);
			captionSettingsData.foregroundColor = Camtasia2JsonReader.cssColorFromJsonArray(jsonData.captionSettings.foregroundColor);
			captionSettingsData.alignment = Camtasia2JsonReader.stringVAlignmentMappings.value[jsonData.captionSettings.alignment.toLowerCase()];

			return captionSettingsData;
		};

		private static captionsFromJsonData(jsonData: Camtasia2JsonObject): LanguageIndexed<CaptionData> {
			if (jsonData.captions === undefined)
				throw new Exception('"captions" is undefined.');

			var captionsData = <LanguageIndexed<CaptionData>>{};
			jsonData.captions.forEach((item: any) => {
				var captionData = <CaptionData>$.extend(new CaptionData(), item);
				captionData.end = captionData.begin + captionData.dur;

				captionsData[item.lang] = captionData;
			});

			return captionsData;
		};

		private static categoriesFromJsonData(jsonData: Camtasia2JsonObject): LanguageIndexed<CategoryData> {
			if (jsonData.categories === undefined)
				throw new Exception('"categories" is undefined.');

			var categoriesData = <LanguageIndexed<CategoryData>>{};
			jsonData.categories.forEach((item: any) => {
				var categoryData = <CategoryData>$.extend(new CategoryData(), item);
				categoryData.end = categoryData.begin + categoryData.dur;

				categoriesData[item.lang] = categoryData;
			});

			return categoriesData;
		};

		private static authorNotesFromJsonData(jsonData: Camtasia2JsonObject): LanguageIndexed<AuthorNoteData> {
			if (jsonData.authorNotes === undefined)
				throw new Exception('"authorNotes" is undefined.');

			var authorNotesData = <LanguageIndexed<AuthorNoteData>>{};
			jsonData.authorNotes.forEach((item: any) => {
				var authorNoteData = <AuthorNoteData>$.extend(new AuthorNoteData(), item);
				if (item.dur === undefined)
					authorNoteData.dur = 0;

				authorNoteData.end = authorNoteData.begin + authorNoteData.dur;
				authorNotesData[item.lang] = authorNoteData;
			});

			return authorNotesData;
		};

		private static chaptersFromJsonData(jsonData: Camtasia2JsonObject): LanguageIndexed<ChapterData> {
			if (jsonData.chapters === undefined)
				throw new Exception('"chapters" is undefined.');

			var chaptersData = <LanguageIndexed<ChapterData>>{};
			jsonData.chapters.forEach((item: any) => {
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

				chaptersData[item.lang] = chapterData;
			});

			return chaptersData;
		};

		private static overlaysFromJsonData(jsonData: Camtasia2JsonObject): LanguageIndexed<OverlayData> {
			if (jsonData.overlays === undefined)
				throw new Exception('"overlays" is undefined.');

			var overlaysData = <LanguageIndexed<OverlayData>>{};
			jsonData.overlays.forEach((item: any) => {
				var overlayData = <OverlayData>$.extend(new OverlayData(), item);
				overlayData.action = Camtasia2JsonReader.stringOverlayActionMappings.value[item.action.toLowerCase()];
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

				overlaysData[item.lang] = overlayData;
			});

			return overlaysData;
		};

		private static authCamFromJsonData(jsonData: Camtasia2JsonObject): AuthCamData {
			if (jsonData.authCam === undefined)
				throw new Exception('"authCam" is undefined.');

			var authCamData = <AuthCamData>$.extend(new AuthCamData(), jsonData.authCam);
			authCamData.end = authCamData.begin + authCamData.dur;
			authCamData.translateTransform = Camtasia2JsonReader.vector3FromJsonArray(jsonData.authCam.translateTransform);
			authCamData.rotateTransform = Camtasia2JsonReader.vector3FromJsonArray(jsonData.authCam.rotateTransform);
			authCamData.shearTransform = Camtasia2JsonReader.vector3FromJsonArray(jsonData.authCam.shearTransform);

			authCamData.media = <LanguageIndexed<MediumData>>{};
			jsonData.authCam.media.forEach((item: any) => authCamData.media[item.lang] = $.extend(new MediumData(), item));

			return authCamData;
		};

		private static vector3FromJsonArray(jsonArray: number[]): Vector3 {
			return new Vector3(jsonArray[0], jsonArray[1], jsonArray[2]);
		}

		private static cssColorFromJsonArray(jsonArray: number[]): string {
			return 'rgba({0}, {1}, {2}, {3})'.format(jsonArray);
		}
	}
}