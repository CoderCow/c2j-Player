declare var DEBUG: boolean;
declare var RELEASE: boolean;

interface Window {
	DEBUG: boolean;
	RELEASE: boolean;
}

// non ES standard navigator attributes
interface Navigator {
	userLanguage: string;
	browserLanguage: string;
	systemLanguage: string;
}