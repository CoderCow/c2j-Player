
declare var DEBUG: boolean;

interface Window {
	DEBUG: boolean;
}

// non ES standard navigator attributes
interface Navigator {
	userLanguage: string;
	browserLanguage: string;
	systemLanguage: string;
}

declare class Exception extends Error {
	/** Initializes a new instance of the Exception class. */
	constructor(message: any, inner?: Exception | undefined)

	/** The exception instances which caused this exception to be thrown.  */
	inner: Exception | undefined;
}

declare enum VAlignment { Center, Left, Right }

/** Maps a IETF language tag (such as "de" or "en-US") to objects of T. */
type LanguageDictionary<T> = { [languageTag: string]: T };
type LanguageTagDictionary = LanguageDictionary<string>

