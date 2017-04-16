require('./globals');
require('./Localization');

import { UserSettings } from './Data/UserSettings';
import { GetParamHandler } from './Data/IO/GetParamHandler';
import { PlayerConfigReader } from './Data/IO/PlayerConfigReader';
import { VideoJSManager } from './VideoJSManager';
import { PlayerConfig } from './Data/PlayerConfig';
import { UserSettingsManager } from './UserSettingsManager';

require('./app.scss');
require('./index.html');
require('./../iconfont/c2jicons.json');

/**
 * Main class of this application.
 */
export class App {
	/** Path (relative URL) to the player's configuration file providing all the default settings. */
	private static CONFIG_PATH = 'config.json';
	private static CONSOLE_MESSAGE_PREFIX = '[C2J Player]';

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

			try {
				App._videoJSManager = new VideoJSManager(App._playerConfig, App.userConfig, (error: Exception) => {
					if (error === undefined) {
						App._userSettingsManager.player = App._videoJSManager.player;
					} else {
						App.fatalError('An error occurred while loading the video data. This video can not be played.'); // note: strings can not be localized as long as the videojs player isn't initialized.
						App.consoleError(`${error.toString()}`);
					}
				});
			} catch (error) {
				App.fatalError('There were no video data provided - no video can be played.');
				App.consoleError(`${error.toString()}`);
			}
		}, (error: Exception) => {
			App.fatalError('This player is not correctly configured. The video can not be played.');
			App.consoleError(`Processing the player's config file has failed: ${error.toString()}`);
		});
	}
	
	/** Displays the given fatal error message to the user and removes the player from the page. */
	public static fatalError(message: string) {
		var errorParagraph = $('.player-error');
		errorParagraph.text(message);
		errorParagraph.removeClass('c2jp-hidden');

		var videoTag = $('.video-js');
		videoTag.addClass('c2jp-hidden');
	}

	/** Displays the given message on the browser's console. */
	public static consoleError(message: string) {
		console.error(`${App.CONSOLE_MESSAGE_PREFIX} ${message}`);
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

$(document).ready(App.main);