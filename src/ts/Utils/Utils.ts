interface String {
	/**
	 * Returns a formatted version of this string by replacing {X} (where X is an index between zero and the arguments length) placeholders with the given argument.
	 *
	 * @returns {String} The formatted string.
	 */
	format(...args: any[]): string;
	startsWith(prefix: string): boolean;
	endsWith(suffix: string): boolean;
}

if (typeof String.prototype.format !== 'function') {
	String.prototype.format = function(...args: any[]): string {
		if (args === undefined)
			return this;
		if (args.length === 1 && Array.isArray(args[0]))
			args = args[0];

    return this.replace(/{(\d+)}/g, (match: string, number: number): any => {
	    let isArgInArray = typeof(args[number] != 'undefined');

	    if (isArgInArray)
		    return args[number];
	    else
		    console.error("String.format error: argument {0} was not found in array.".format(match));
	  });
  };
}

if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function(value: string): boolean {
    return (this.indexOf(value) == 0);
  };
}

if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function (value: string): boolean {
    return (this.indexOf(value) == this.length - value.length);
  };
}

function parseDateUTC(dateString: string): Date {
	'use strict';
	// Turn date string into an UTC date string if necessary.
	if (!dateString.endsWith('Z'))
		dateString += 'Z';

	return new Date(dateString);
}

var __absoluteUrlTester = new RegExp('^(?:[a-z]+:)?//', 'i');
function isAbsoluteUrl(url: string) {
	'use strict';
	return __absoluteUrlTester.test(url);
}

function isEqualLanguageCode(codeA: string, codeB: string): boolean {
	'use strict';

	return normalizeLanguageCode(codeA) === normalizeLanguageCode(codeB);
}

/**
 * "en-US" becomes "en-us", "de-de" becomes "de"
 * @param code
 * @returns {string}
 */
function normalizeLanguageCode(code: string): string {
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