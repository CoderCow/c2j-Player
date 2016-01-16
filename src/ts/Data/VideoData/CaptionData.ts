module Player {
	'use strict';
	export class CaptionData implements Validatable {
		public begin: number;
		public dur: number;
		public end: number;
		public content: string;
		public lang: string;

		public invalidate(): void {
			Validate.number(this.begin, 'begin', 0);
			Validate.number(this.dur, 'dur', 0);
			Validate.number(this.end, 'end', 0);
			Validate.string(this.content, 'content');
			Validate.string(this.lang, 'lang');
		}
	}
}