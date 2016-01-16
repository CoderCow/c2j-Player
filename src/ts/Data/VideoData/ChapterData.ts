module Player {
	'use strict';
	export class ChapterData implements Validatable {
		public id: number;
		public begin: number;
		public dur: number;
		public end: number;
		public lang: string;
		public title: string;
		public tooltip: string;
		public tags: string;
		public additionals: ChapterAdditionalData[];

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