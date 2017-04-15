import { PlayerConfig } from './../PlayerConfig';
type GetParameterSet = { [param: string]: string[] };

/** Interprets the GET parameters in the URL and applies them to the player configuration. */
export class GetParamHandler {
	private static _timeRegex = /^(?:([\d\.]+)m)?(?:([\d\.]+)s)?$/;

	/**
	 * Interprets the current GET parameters passed as part of the url and changes settings of the given PlayerConfig
	 * object accordingly.
	 */
	public handleGetParams(playerConfigToUpdate: PlayerConfig) {
		var parameterSet: GetParameterSet = GetParamHandler.getParamSet();

		GetParamHandler.processStringParam('video', parameterSet, false, (value: string) =>
			playerConfigToUpdate.videoMetadataUrl = value);

		GetParamHandler.processTimeParam('time', parameterSet, (value: number) =>
			playerConfigToUpdate.startPlaybackAt = value);

		GetParamHandler.processStringParam('metabase', parameterSet, true, (value: string) =>
			playerConfigToUpdate.videoMetaBaseUrl = value);

		GetParamHandler.processStringParam('mediabase', parameterSet, true, (value: string) =>
			playerConfigToUpdate.videoMediaBaseUrl = value);

		GetParamHandler.processBooleanParam('nofs', parameterSet, true, (value: boolean) =>
			playerConfigToUpdate.disallowFullscreen = value);

		GetParamHandler.processBooleanParam('noan', parameterSet, true, (value: boolean) =>
			playerConfigToUpdate.disableAuthorNotes = value);

		GetParamHandler.processBooleanParam('noov', parameterSet, true, (value: boolean) =>
			playerConfigToUpdate.disableOverlays = value);

		GetParamHandler.processBooleanParam('simplelangsel', parameterSet, true, (value: boolean) =>
			playerConfigToUpdate.simpleLanguageSelection = value);

		GetParamHandler.processBooleanParam('subs', parameterSet, true, (value: boolean) =>
			playerConfigToUpdate.enableSubtitlesByDefault = value);

		GetParamHandler.processStringParam('playerlang', parameterSet, false, (value: string) =>
			playerConfigToUpdate.playerLanguage = value);

		GetParamHandler.processStringParam('medialang', parameterSet, false, (value: string) =>
			playerConfigToUpdate.mediaLanguage = value);

		GetParamHandler.processStringParam('addslang', parameterSet, false, (value: string) =>
			playerConfigToUpdate.additionalsLanguage = value);

		GetParamHandler.processStringParam('subslang', parameterSet, false, (value: string) =>
			playerConfigToUpdate.subtitlesLanguage = value);

		GetParamHandler.processBooleanParam('autoplay', parameterSet, true, (value: boolean) =>
			playerConfigToUpdate.autoplay = value);
	}

	/**
	 * Evaluates the parameter with the given name from the given parameter set as a string array in respect to the given conditions and then
	 * calls the given process function with the interpreted parameter string array.
	 * @param process Function called for further processing, passing the string array as the parameter value.
	 */
	private static processStringsParam(paramName: string, parameterSet: GetParameterSet, allowEmptyString: boolean, process: (paramValue: string[]) => void) {
		if (!(paramName in parameterSet))
			return;

		var paramValues: string[] = parameterSet[paramName];
		if (!allowEmptyString) {
			for (var i = 0; i < paramValues.length; i++) {
				var paramValue = paramValues[i];
				if (paramValue === undefined || paramValue === '') {
					console.warn(`One of the values in get-Parameter '${paramName}' was set to an empty value and was ignored.`);
					paramValues.splice(i, 1);
				}
			}
		}

		if (paramValues.length > 0)
			process(paramValues);
	}

	/**
	 * Evaluates the parameter with the given name from the given parameter set as a string in respect to the given conditions and then
	 * calls the given process function with the interpreted parameter string value.
	 * @param process Function called for further processing, passing the string as the parameter value.
	 */
	private static processStringParam(paramName: string, parameterSet: GetParameterSet, allowEmptyString: boolean, process: (paramValue: string) => void) {
		if (!(paramName in parameterSet))
			return;

		var paramValues = parameterSet[paramName];
		if (paramValues.length > 1)
			console.warn(`Multiple values for get-parameter '${paramName}' are not supported. The first value will be used.`);

		var paramValue = paramValues[0];
		var isValid = true;
		if (!allowEmptyString && paramValue === undefined || paramValue === '') {
			console.warn(`Get-Parameter '${paramName}' was set to an empty value and was ignored.`);
			isValid = false;
		}

		if (isValid)
			process(paramValue);
	}

	/**
	 * Evaluates the parameter with the given name from the given parameter set as a boolean in respect to the given conditions and then
	 * calls the given process function with the interpreted parameter boolean value.
	 * @param process Function called for further processing, passing the boolean as the parameter value.
	 */
	private static processBooleanParam(paramName: string, parameterSet: GetParameterSet, emptyValueMeansTrue: boolean, process: (paramValue: boolean | undefined) => void) {
		if (!(paramName in parameterSet))
			return;

		var paramValues = parameterSet[paramName];
		if (paramValues.length > 1)
			console.warn(`Multiple values for get-parameter '${paramName}' are not supported. The first value will be used.`);

		var paramValue = paramValues[0];
		var paramBooleanValue: boolean | undefined;
		var isValid = true;
		if (emptyValueMeansTrue && (paramValue === undefined || paramValue === '')) {
			paramBooleanValue = true;
		} else {
			paramValue = paramValue.toLowerCase();

			if (paramValue === '1' || paramValue === 'true' || paramValue === 'enable' || paramValue === 'enabled' || paramValue === 'yes') {
				paramBooleanValue = true;
			} else if (paramValue === '0' || paramValue === 'false' || paramValue === 'disable' || paramValue === 'disabled' || paramValue === 'no') {
				paramBooleanValue = false;
			} else {
				isValid = false;
			}
		}

		if (!isValid) {
			console.warn(`Get-Parameter '${paramName}' could not be recognized as a boolean value and was ignored.`);
			return;
		}

		if (isValid)
			process(paramBooleanValue);
	}

	/**
	 * Evaluates the parameter with the given name from the given parameter set as a time value in respect to the given conditions and then
	 * calls the given process function with the interpreted parameter number value.
	 * @param process Function called for further processing, passing the number of parsed seconds as parameter.
	 */
	private static processTimeParam(paramName: string, parameterSet: GetParameterSet, process: (paramValue: number) => void) {
		if (!(paramName in parameterSet))
			return;

		var paramValues = parameterSet[paramName];
		if (paramValues.length > 1)
			console.warn(`Multiple values for get-parameter '${paramName}' are not supported. The first value will be used.`);

		var paramValue = paramValues[0];
		var isValid = true;
		if (paramValue === '') {
			console.warn(`Get-Parameter '${paramName}' was set to an empty value and was ignored.`);
			isValid = false;
		}

		var totalSeconds = 0.0;
		try {
			var match = GetParamHandler._timeRegex.exec(paramValue.trim());
			if (match !== null) {
				var minutes = match[1];
				if (minutes !== undefined)
					totalSeconds += parseFloat(minutes) * 60;

				var seconds = match[2];
				if (seconds !== undefined)
					totalSeconds += parseFloat(seconds);

				if (isNaN(totalSeconds))
					isValid = false;
			} else {
				isValid = false;
			}
		} catch (err) {
			isValid = false;
			console.warn(`Error parsing time: ` + err.toString());
		}

		if (!isValid) {
			console.warn(`Get-Parameter '${paramName}' did not represent a valid time and was ignored. A valid example time would be '3m22.5s'.`);
			return;
		}

		if (isValid)
			process(totalSeconds);
	}

	/**
	 * Creates a GetParamSet from the parameters provided in the URL the current page was loaded with.
	 * Note that this function allows for passing multiple parameters with the same name, mapping the values to an array of
	 * strings (e.g. ?a=val1&a=val2 would become GetParameterSet['a'] = ['val1', 'val2']).
	 */
	private static getParamSet(): GetParameterSet {
		var result: GetParameterSet = {};

		var paramsWithoutQuestionMark = location.search.substr(1);
		paramsWithoutQuestionMark.split("&").forEach((paramValuePair: string) => {
			var paramAndValue = paramValuePair.split("=");
			var paramName = paramAndValue[0].toLowerCase();
			var paramValue = paramAndValue[1] && decodeURIComponent(paramAndValue[1]);

			// multi keyed parameter support, like ?a=val1&a=val2 will become a: ['val1', 'val2']
			if (paramName in result)
				result[paramName].push(paramValue);
			else
				result[paramName] = [paramValue];
		});

		return result;
	}
}
