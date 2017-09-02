import { IPlayerConfig } from './../IPlayerConfig';
import { PlayerConfig } from './../PlayerConfig';

/** Retrieves and reads json encoded player configuration files. */
export class PlayerConfigReader {
	/**
	 * Retrieves the json data from the given url and parses it into a PlayerConfig object.
	 * @throws {Exception} When retrieving or parsing the config has failed.
	 */
	public read(jsonUrl: string, callback: (data: PlayerConfig) => void, errorCallback: (exception: Exception) => void) {
		$.getJSON(jsonUrl).done((jsonObject: any) => {
			var configData: PlayerConfig;
			try {
				configData = PlayerConfigReader.configDataFromJson(<IPlayerConfig>jsonObject);
				callback(configData);
			} catch (e) {
				errorCallback(e);
			}
		}).fail((jqXhr: JQueryXHR, status: string, error: Error) => {
			errorCallback(new Exception(`Retrieving file has failed with ${status}: ${error}`));
		});
	}

	/** Creates a new PlayerConfig object from the given json data. */
	private static configDataFromJson(jsonData: IPlayerConfig): PlayerConfig {
		jsonData.defaultVideoMetadataUrl = PlayerConfigReader.correctedString(jsonData.defaultVideoMetadataUrl);
		jsonData.videoMetaBaseUrl = PlayerConfigReader.correctedString(jsonData.videoMetaBaseUrl);
		jsonData.videoMediaBaseUrl = PlayerConfigReader.correctedString(jsonData.videoMediaBaseUrl);
		jsonData.disallowFullscreen = PlayerConfigReader.correctedValue(jsonData.disallowFullscreen);
		jsonData.enableSubtitlesByDefault = PlayerConfigReader.correctedValue(jsonData.enableSubtitlesByDefault);
		jsonData.disableAuthorNotes = PlayerConfigReader.correctedValue(jsonData.disableAuthorNotes);
		jsonData.disableOverlays = PlayerConfigReader.correctedValue(jsonData.disableOverlays);

		var result = new PlayerConfig();
		$.extend(result, jsonData);

		return result;
	}

	/**
	 * When the input string is an empty string undefined is returned.
	 * Otherwise the input string is returned.
	 */
	private static correctedString(input: string | undefined): string | undefined {
		if (input === '')
			return undefined;

		return PlayerConfigReader.correctedValue(input);
	}

	/** When the input value is undefined, null is returned. Otherwise the input value is returned. */
	private static correctedValue(input: any): any {
		if (input === undefined)
			return null;

		return input;
	}
}
