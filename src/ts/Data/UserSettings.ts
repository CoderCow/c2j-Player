module Player {
	'use strict';
	export class UserSettings {
		private static CURRENT_VERSION = 1;

		public version: number;
		public volume: number;

		public constructor() {
			this.version = UserSettings.CURRENT_VERSION;
			this.volume = 1;
		}

		public fromJson(jsonObject: any) {
			Validate.value(jsonObject, 'jsonObject');

			if (jsonObject.version === UserSettings.CURRENT_VERSION) {
				$.extend(this, jsonObject);
				this.version = UserSettings.CURRENT_VERSION;
			} else {
				console.warn('User settings have been reset because they were outdated.');
			}
		}

		public toJson(): string {
			return JSON.stringify(this);
		}
	}
}