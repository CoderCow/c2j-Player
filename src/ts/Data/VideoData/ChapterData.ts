module Player {
	'use strict';
	/**
	 * Represents the data of chapter of the video metadata.
	 */
	export class ChapterData implements IValidatable {
		public id: number;
		/** Start time in seconds (decimal). */
		public begin: number;
		/** Duration time in seconds (decimal). */
		public dur: number;
		/** End time in seconds (decimal). */
		public end: number;
		/** IETF language tag. */
		public lang: string;
		public title: string;
		public tooltip: string;
		public tags: string;
		public additionals: ChapterAdditionalData[];

		/** @inheritdoc */
		public invalidate(): void {
			Validate.number(this.id, 'id', 0);
			Validate.number(this.begin, 'begin');
			Validate.number(this.dur, 'dur');
			Validate.number(this.end, 'end');
			Validate.languageCode(this.lang, 'lang');
			Validate.string(this.title, 'title');
			Validate.string(this.tooltip, 'tooltip');
			Validate.string(this.tags, 'tags');
			Validate.value(this.additionals, 'additionals');
		}
	}
}