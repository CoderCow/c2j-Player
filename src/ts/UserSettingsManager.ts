module Player {
	'use strict';
	export class UserSettingsManager {
		private static LOCAL_STORAGE_KEY = 'userSettings';
		private _userSettings: UserSettings;
		public player: VideoJSPlayer;

		public constructor() {
			this.player = null;

			this._userSettings = new UserSettings();
			var configData = window.localStorage.getItem(UserSettingsManager.LOCAL_STORAGE_KEY);
			var configExists = (configData !== null);
			if (configExists) {
				try {
					this._userSettings.fromJson(JSON.parse(configData));
				} catch (e) {
					console.warn('Parsing the user configuration has failed: ' + e.toString());
					this._userSettings = new UserSettings();
				}
			} else {
				if (DEBUG)
					console.log('User config doesn\'t exist. A new one will be created.');
			}

			$(window).unload(() => {
				if (this.player !== undefined && this.player !== null) {
					this._userSettings.volume = this.player.volume();
				} else {
					console.error('Player was never set in the UserSettingsManager - some settings could not be updated.');
				}

				this.storeConfig();
			});
		}

		public storeConfig() {
			window.localStorage.setItem(UserSettingsManager.LOCAL_STORAGE_KEY, this._userSettings.toJson());
		}

		public reset() {
			window.localStorage.setItem(UserSettingsManager.LOCAL_STORAGE_KEY, null);
		}

		public get userSettings(): UserSettings {
			return this._userSettings;
		}
	}
}