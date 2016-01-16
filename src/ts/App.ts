module Player {
	'use strict';
	export class App {
		private static _userSettingsManager: UserSettingsManager;
		private static _videoJSManager: VideoJSManager;

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

			App._userSettingsManager = new UserSettingsManager();

			App._videoJSManager = new VideoJSManager(App.userConfig);
			App._videoJSManager.init(() => {
				App._userSettingsManager.player = App.player;
			});

			var reader = new Camtasia2JsonReader();
			reader.read('videos/demo.json', (videoData: VideoData) => {
				videoData.invalidate();
			}, (error: Exception) => {
				alert(error);
			});
		}

		public static get userConfig(): UserSettings {
			return App._userSettingsManager.userSettings;
		}

		public static get player(): VideoJSPlayer {
			var player = App._videoJSManager.player;
			if (player === null)
				console.error('The videojs player is not initialized yet.');

			return player;
		}
	}
}

$(document).ready(Player.App.main);

// This is some black magic in order to allow TypeScript to resolve the video.js classes so that we can
// inherit from these classes and stuff.
(<any>window).VideoJSButton = videojs.getComponent('Button');