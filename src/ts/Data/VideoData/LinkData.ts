module Player {
	'use strict';
	/**
	 * Represents the data of a link as used in chapters or overlays in the video metadata.
	 */
	export class LinkData implements IValidatable {
		public title: string;
		public href: string;
		public tooltip: string;

		/** @inheritdoc */
		public invalidate(): void {
			Validate.string(this.title, 'title');
			Validate.string(this.href, 'href');
			Validate.string(this.tooltip, 'tooltip');
		}
	}
}