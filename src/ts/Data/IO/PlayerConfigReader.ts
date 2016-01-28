module Player {
	'use strict';
	export class PlayerConfigReader {
		public read(jsonUrl: string, callback: (data: PlayerConfig) => void, errorCallback: (exception: Exception) => void) {
			$.getJSON(jsonUrl).done((jsonObject: any) => {
				var configData: PlayerConfig;
				try {
					configData = PlayerConfigReader.configDataFromJson(<PlayerConfigJsonObject>jsonObject);
				} catch (e) {
					errorCallback(e);
				}

				callback(configData);
			}).fail((jqXhr: JQueryXHR, status: string, error: Error) => {
				errorCallback(new Exception(`Retrieving file has failed with ${status}: ${error}`));
			});
		}

		private static configDataFromJson(jsonData: PlayerConfigJsonObject): PlayerConfig {
			jsonData.defaultVideoMetadataUrl = PlayerConfigReader.correctedString(jsonData.defaultVideoMetadataUrl);
			jsonData.videoMetaBaseUrl = PlayerConfigReader.correctedString(jsonData.videoMetaBaseUrl);
			jsonData.videoMediaBaseUrl = PlayerConfigReader.correctedString(jsonData.videoMediaBaseUrl);
			jsonData.disallowFullscreen = PlayerConfigReader.correctedValue(jsonData.disallowFullscreen);
			jsonData.enableSubtitleByDefault = PlayerConfigReader.correctedValue(jsonData.enableSubtitleByDefault);
			jsonData.disableAuthorNotes = PlayerConfigReader.correctedValue(jsonData.disableAuthorNotes);
			jsonData.disableOverlays = PlayerConfigReader.correctedValue(jsonData.disableOverlays);

			var result = new PlayerConfig();
			$.extend(result, jsonData);

			return result;
		}

		private static correctedString(input: string): string {
			if (input === '')
				return null;

			return PlayerConfigReader.correctedValue(input);
		}

		private static correctedValue(input: any): any {
			if (input === undefined)
				return null;

			return input;
		}
	}
}