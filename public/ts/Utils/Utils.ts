export class Utils {
	/**
	 * Parses a date string and returns a Date object. If no UTC time zone identifier is given in
	 * date string, it will be expected to be a UTC date.
	 */
	public static parseDateUTC(dateString: string): Date {
		'use strict';
		// Turn date string into an UTC date string if necessary.
		if (!dateString.endsWith('Z'))
			dateString += 'Z';

		return new Date(dateString);
	}

	private static _absoluteUrlTester = new RegExp('^(?:[a-z]+:)?//', 'i');
	/**
	 * Returns true if the given url is an absolute url (that is if the url contains a protocol name like http://someurl),
	 * otherwise false.
	 */
	public static isAbsoluteUrl(url: string): boolean {
		'use strict';
		return Utils._absoluteUrlTester.test(url);
	}

	/** Compares two language code strings, where "de" will be equal to "de-DE" etc. */
	public static isEqualLanguageCode(codeA: string, codeB: string): boolean {
		'use strict';

		return Utils.normalizeLanguageCode(codeA) === Utils.normalizeLanguageCode(codeB);
	}

	/**
	 * "en-US" becomes "en-us", "de-de" becomes "de"
	 * @param code
	 * @returns {string}
	 */
	public static normalizeLanguageCode(code: string): string {
		'use strict';

		code = code.toLowerCase();

		var minusIndex = code.indexOf('-');
		if (minusIndex !== -1) {
			var first = code.substr(0, minusIndex);
			var second = code.substr(minusIndex + 1);
			if (first === second)
				return first;
		}

		return code;
	}
}
