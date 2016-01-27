// Sources for language name translations:
//   https://www.loc.gov/standards/iso639-2/php/code_list.php
//   https://docs.google.com/spreadsheets/d/1rscLc4rSe3-wBvg_TtLf_m5PeHZALe_btXHKEl_zQY4

interface LanguageCodeTable { [code: string]: string }

function __getLanguageCodeTable(): LanguageCodeTable {
	return {
		"af": "Afrikaans",
		"ar": "Arabic",
		"ba": "Bashkir",
		"bg": "Bulgarian",
		"ca": "Catalan",
		"cs": "Czech",
		"da": "Danish",
		"de": "German",
		"en": "English",
		"es": "Spanish",
		"fi": "Finnish",
		"fr": "French",
		"hr": "Croatian",
		"hu": "Hungarian",
		"it": "Italian",
		"ja": "Japanese",
		"ko": "Korean",
		"nl": "Dutch",
		"pt": "Portuguese",
		"pt-br": "Portuguese (Brazil)",
		"ru": "Russian",
		"sr": "Serbian",
		"sv": "Swedish",
		"tr": "Turkish",
		"uk": "Ukrainian",
		"vi": "Vietnamese",
		"zh-cn": "Chinese (PRC)",
		"zh-tw": "Chinese (Taiwan)",
	};
}