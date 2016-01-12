module Player {
	'use strict';
	export class App {
		/**
		 * This function can be seen as the main entry point of the application.
		 */
		public static main() {
			// Set default debug symbols, if not already set by the preprocessor.
			if (window.RELEASE === undefined && window.DEBUG === undefined) {
				window.RELEASE = false;
				window.DEBUG = true;
			}
			if (DEBUG)
				dust.debugLevel = "WARN";

			var manager = new VideoJSManager();
			manager.init();
		}
	}
}

$(document).ready(Player.App.main);