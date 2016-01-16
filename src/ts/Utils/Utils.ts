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
    return (this.slice(0, value.length) == value);
  };
}

if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function (value: string): boolean {
    return (this.slice(-value.length) == value);
  };
}

'use strict';
function parseDateUTC(dateString: string): Date {
	// Turn date string into an UTC date string if necessary.
	if (!dateString.endsWith('Z'))
		dateString += 'Z';

	return new Date(dateString);
}