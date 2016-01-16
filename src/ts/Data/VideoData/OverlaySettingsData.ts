module Player {
	'use strict';
	export class OverlaySettingsData implements Validatable {
		public isEnabledByDefault: boolean;
		public isSwitchable: boolean;

		public invalidate() {
			Validate.value(this.isEnabledByDefault, 'isEnabledByDefault');
			Validate.value(this.isSwitchable, 'isSwitchable');
		}
	}
}