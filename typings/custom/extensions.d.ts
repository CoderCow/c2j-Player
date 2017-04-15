/** Extension declarations to the JavaScript string type. */
interface String {
	/**
	 * Returns a formatted version of this string by replacing {X} (where X is an index
	 * between zero and the arguments length) placeholders with the given arguments.
	 *
	 * @returns {String} The formatted string.
	 */
	format(...args: any[]): string;
	/** Returns true if this string starts with the given string, otherwise false. */
	startsWith(prefix: string): boolean;
	/** Returns true if this string ends with the given string, otherwise false. */
	endsWith(suffix: string): boolean;
}
