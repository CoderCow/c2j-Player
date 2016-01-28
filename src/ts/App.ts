module Player {
	'use strict';
	export class App {
		private static CONFIG_PATH = 'config.json';

		private static _userSettingsManager: UserSettingsManager;
		private static _videoJSManager: VideoJSManager;
		private static _playerConfig: PlayerConfig;

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
				dust.debugLevel = "WARN";

				// Register F4 key to pause JavaScript execution.
				// This is especially useful if you want to analyze DOM or CSS that shows up during
				// special mouse events only.
				$(window).keydown((e: KeyboardEvent) => {
					if (e.keyCode == 115)
						debugger;
					}
				);
			}

			App._userSettingsManager = new UserSettingsManager();

			var configReader = new PlayerConfigReader();
			configReader.read(App.CONFIG_PATH, (configData: PlayerConfig) => {
				new GetParamHandler().handleGetParams(configData);
				configData.invalidate();

				App._playerConfig = configData;

				App._videoJSManager = new VideoJSManager(App._playerConfig, App.userConfig, () => {
					// TODO: improve this
					App._userSettingsManager.player = App.player;
				});
			}, (error: Exception) => {
				console.error(`Processing the player's config file has failed: ${error.toString()}`);
			});

			/*var reader = new Camtasia2JsonReader();
			reader.read(App.VIDEO_BASE_PATH + 'demo.json', (videoData: VideoData) => {
				videoData.invalidate();
				App._videoData = videoData;

				App._videoJSManager = new VideoJSManager(App.userConfig, App.videoData);
				App._videoJSManager.init(() => {
					App._userSettingsManager.player = App.player;
				});
			}, (error: Exception) => {
				console.log(error.toString());
			});*/
		}

		public static get userConfig(): UserSettings {
			return App._userSettingsManager.userSettings;
		}

		public static get playerConfig(): PlayerConfig {
			return App._playerConfig;
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
(<any>window).VideoJSComponent = videojs.getComponent('Component');
(<any>window).VideoJSButton = videojs.getComponent('Button');
(<any>window).VideoJSMenuButton = videojs.getComponent('MenuButton');
(<any>window).VideoJSMenuItem = videojs.getComponent('MenuItem');
(<any>window).VideoJSMenu = videojs.getComponent('Menu');