module Player {
	'use strict';
	export class CategoryData implements Validatable {
		public begin: number;
		public dur: number;
		public end: number;
		public title: string;
		public description: string;
		public lang: string;
		public tooltip: string;

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