module Player {
	'use strict';
	/**
	 * Represents the data of a category of the video metadata.
	 */
	export class CaptionSettingsData implements IValidatable {
		public fontName: string;
		public backgroundColor: number[];
		public foregroundColor: number[];
		public alignment: VAlignment;
		public opacity: number;
		public isBackgroundEnabled: boolean;
		public isBackgroundOnlyAroundText: boolean;

		/** @inheritdoc */
		public invalidate() {
			Validate.string(this.fontName, 'fontName');
			Validate.value(this.backgroundColor, 'backgroundColor');
			Validate.value(this.foregroundColor, 'foregroundColor');
			Validate.value(this.alignment, 'alignment');
			Validate.number(this.opacity, 'opacity');
			Validate.value(this.isBackgroundEnabled, 'isBackgroundEnabled');
			Validate.value(this.isBackgroundOnlyAroundText, 'isBackgroundOnlyAroundText');
		}
	}
}