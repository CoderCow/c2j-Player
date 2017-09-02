import { Validate } from './Utils/Validate';
import { UserSettings } from './Data/UserSettings';
/**
 * Maintains user settings by loading and storing them in the local storage of the browser.
 */
export class UserSettingsManager {
	/**
	 * A version number is stored along with the settings for backward compatibility.
	 * This number should be increased whenever the UserSettings object has dramatically changed.
	 */
	private static CURRENT_VERSION = 1;
	private static LOCAL_STORAGE_VERSION_KEY = 'userSettingsVersion';
	private static LOCAL_STORAGE_KEY = 'userSettings';
	
	private _userSettings: UserSettings;
	public player?: VideoJSPlayer;

	/** Initializes a new instance of this class and reads the user settings from the local storage. */
	public constructor() {
		this._userSettings = new UserSettings();
		var configDataVersion = window.localStorage.getItem(UserSettingsManager.LOCAL_STORAGE_VERSION_KEY);
		var configData = window.localStorage.getItem(UserSettingsManager.LOCAL_STORAGE_KEY);
		var configExists = (configDataVersion !== null && configData !== null);
		if (configExists) {
			try {
				this._userSettings = this.userSettingsFromString(<string>configData, parseInt(<string>configDataVersion, 10));
			} catch (e) {
				console.warn('Reading the user settings has failed: ' + e.toString());
				this._userSettings = new UserSettings();
			}
		} else {
			if (DEBUG)
				console.log('User config does not exist. A new one will be created.');
		}

		$(window).on("unload", () => {
			if (this.player !== undefined && this.player !== null) {
				this._userSettings.volume = this.player.volume();
			} else {
				console.error('Player was never set in the UserSettingsManager - some settings could not be updated.');
			}

			this.storeSettings();
		});
	}

	/** Stores the current user settings in the local storage. */
	public storeSettings() {
		window.localStorage.setItem(UserSettingsManager.LOCAL_STORAGE_VERSION_KEY, UserSettingsManager.CURRENT_VERSION.toString());
		window.localStorage.setItem(UserSettingsManager.LOCAL_STORAGE_KEY, this.userSettingsToString(this._userSettings));
	}

	/** Removes all user settings from the local storage. */
	public reset() {
		window.localStorage.setItem(UserSettingsManager.LOCAL_STORAGE_VERSION_KEY, '');
		window.localStorage.setItem(UserSettingsManager.LOCAL_STORAGE_KEY, '');
	}
	
	/** 
	 * Deserializes the given string into a new user settings object.
	 * The string is expected to be encoded in a format compatible to the given version number.
	 */
	public userSettingsFromString(userSettingsString: string, version: number): UserSettings {
		Validate.value(userSettingsString, 'userSettingsString');

		var resultingSettings = new UserSettings();
		if (version === UserSettingsManager.CURRENT_VERSION) {
			var jsonObject = JSON.parse(userSettingsString);
			$.extend(resultingSettings, jsonObject);
		} else {
			console.warn('User settings have been reset because they were outdated.');
		}

		return resultingSettings;
	}

	/** Serializes the given user settings into a string. */
	public userSettingsToString(userSettings: UserSettings): string {
		return JSON.stringify(userSettings);
	}

	/** Gets the current user settings. */
	public get userSettings(): UserSettings {
		return this._userSettings;
	}
}
