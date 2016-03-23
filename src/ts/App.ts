module Player {
	'use strict';
	/**
	 * Main class of this application.
	 */
	export class App {
		/** Path (relative URL) to the player's configuration file providing all the default settings. */
		private static CONFIG_PATH = 'config.json';

		/** Manages user settings (saved in the local storage of the browser). */
		private static _userSettingsManager: UserSettingsManager;
		/** Represents the current player configuration data. */
		private static _playerConfig: PlayerConfig;
		/** Maintains the videojs instance and all our extensions to it. */
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
			if (DEBUG) {
				// The Dust template engine should at least tell us when a template could not be applied or found.
				dust.debugLevel = "WARN";

				// Register F4 key to pause JavaScript execution.
				// This is especially useful if you want to analyze DOM or CSS that shows up during
				// special mouse events only.
				$(window).keydown((e: KeyboardEvent) => {
					if (e.keyCode == 115)
						debugger;
				});
			}

			App._userSettingsManager = new UserSettingsManager();

			var configReader = new PlayerConfigReader();
			// Read the player's default configuration.
			configReader.read(App.CONFIG_PATH, (configData: PlayerConfig) => {
				// Handle URL get parameters and override default config settings accordingly.
				new GetParamHandler().handleGetParams(configData);
				configData.invalidate();

				App._playerConfig = configData;

				App._videoJSManager = new VideoJSManager(App._playerConfig, App.userConfig, () => {
					App._userSettingsManager.player = App._videoJSManager.player;
				});
			}, (error: Exception) => {
				console.error(`Processing the player's config file has failed: ${error.toString()}`);
			});
		}

		/** Gets the current user settings (such as current volume, mute status etc.). */
		public static get userConfig(): UserSettings {
			return App._userSettingsManager.userSettings;
		}

		/** Gets the current player configuration data. */
		public static get playerConfig(): PlayerConfig {
			return App._playerConfig;
		}

		/**
		 * Gets the current videojs player instance.
		 * @throws When player is not initialized yet.
		 */
		public static get player(): VideoJSPlayer {
			var player = App._videoJSManager.player;
			if (player === null)
				console.error('The videojs player is not initialized yet.');

			return player;
		}
	}
}

$(document).ready(Player.App.main);

// Some dark magic in order to allow TypeScript to resolve the video.js classes so that we can
// inherit from these classes and do stuff.
(<any>window).VideoJSComponent = videojs.getComponent('Component');
(<any>window).VideoJSButton = videojs.getComponent('Button');
(<any>window).VideoJSMenuButton = videojs.getComponent('MenuButton');
(<any>window).VideoJSMenuItem = videojs.getComponent('MenuItem');
(<any>window).VideoJSMenu = videojs.getComponent('Menu');