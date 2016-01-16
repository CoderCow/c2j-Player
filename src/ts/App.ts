module Player {
	'use strict';
	export class App {
		/**
		 * This function can be seen as the main entry point of the application.
		 */
		public static main() {
			// Set default debug symbols, if not already set by the preprocessor.
			if (window['RELEASE'] === undefined && window['DEBUG'] === undefined) {
				window['RELEASE'] = false;
				window['DEBUG'] = true;
			}
			if (DEBUG)
				dust.debugLevel = "WARN";

			var manager = new VideoJSManager();
			manager.init();

			var reader = new Camtasia2JsonReader();
			reader.read('videos/demo.json', (videoData: VideoData) => {
				videoData.invalidate();
			}, (error) => {
				alert(error);
			});
		}
	}
}

$(document).ready(Player.App.main);

// This is some black magic in order to allow TypeScript to resolve the video.js classes so that we can
// inherit from these classes and stuff.
(<any>window).VideoJSButton = videojs.getComponent('Button');