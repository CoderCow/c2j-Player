module Player {
	'use strict';
	/** An interface which complies to player configuration json object. */
	export interface IPlayerConfig {
		/**
		 * The default video metadata to load, when none was provided by get-parameter.
		 */
		defaultVideoMetadataUrl: string;

		/**
		 * When metadata is given with a relative url, it will be concat with this as its base url.
		 * If the base url itself is relative, then it will be relative to the player's index.html.
		 * This attribute is optional, the base path defaults to the player's index.html.
		 */
		videoMetaBaseUrl: string;

		/**
		 * When media is defined with a relative url, it will be concat with this as its base url.
		 * If the base url itself is relative, then it will be relative to the player's index.html.
		 * This attribute is optional, the base path defaults to the player's index.html.
		 */
		videoMediaBaseUrl: string;

		/**
		 * Whether to disallow fullscreen or not.
		 * This attribute is optional, it defaults to false.
		 */
		disallowFullscreen: boolean;

		/**
		 * When set to true, subtitles will be enabled, even if the video is already in the user's
		 * native language.
		 * This attribute is optional, it defaults to false.
		 */
		enableSubtitlesByDefault: boolean;

		/**
		 * When set to true, author notes will be completely disabled.
		 * This attribute is optional, it defaults to false.
		 */
		disableAuthorNotes: boolean;

		/**
		 * When set to true, overlays will be completely disabled. This setting will also override the
		 * 'OverlaySettings.isEnabledByDefault' setting of the video metadata.
		 * This attribute is optional, it defaults to false.
		 */
		disableOverlays: boolean;

		/**
		 * Sets the language of the player.
		 * This attribute is optional, it defaults to the language of the browser.
		 */
		playerLanguage: string;
	}
}