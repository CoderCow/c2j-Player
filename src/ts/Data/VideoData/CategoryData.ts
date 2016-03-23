module Player {
	'use strict';
	/**
	 * Represents the data of a category of the video metadata.
	 */
	export class CategoryData implements IValidatable {
		/** Start time in seconds (decimal). */
		public begin: number;
		/** Duration time in seconds (decimal). */
		public dur: number;
		/** End time in seconds (decimal). */
		public end: number;
		public title: string;
		public description: string;
		public lang: string;
		public tooltip: string;

		/** @inheritdoc */
		public invalidate(): void {
			Validate.number(this.begin, 'begin');
			Validate.number(this.dur, 'dur');
			Validate.number(this.end, 'end');
			Validate.string(this.title, 'title');
			Validate.string(this.description, 'content');
			Validate.languageCode(this.lang, 'lang');
			Validate.string(this.tooltip, 'tooltip');
		}
	}
}