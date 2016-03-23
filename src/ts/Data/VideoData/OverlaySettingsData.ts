module Player {
	'use strict';
	/**
	 * Represents the overlay settings part of the video metadata.
	 */
	export class OverlaySettingsData implements IValidatable {
		public isEnabledByDefault: boolean;
		/** Whether the user should be able to turn overlays on or off. */
		public isSwitchable: boolean;

		/** @inheritdoc */
		public invalidate() {
			Validate.value(this.isEnabledByDefault, 'isEnabledByDefault');
			Validate.value(this.isSwitchable, 'isSwitchable');
		}
	}
}