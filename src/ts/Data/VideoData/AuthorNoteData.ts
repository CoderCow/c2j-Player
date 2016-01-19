module Player {
	'use strict';
	export class AuthorNoteData implements NoteData, Validatable {
		public begin: number;
		public dur: number;
		public end: number;
		public title: string;
		public content: string;
		public lang: string;
		public displayInTimeline: boolean;
		public displayInChapters: boolean;
		public displayOnScreen: boolean;

		public invalidate(): void {
			Validate.number(this.begin, 'begin');
			Validate.number(this.dur, 'dur');
			Validate.number(this.end, 'end');
			Validate.string(this.title, 'title');
			Validate.string(this.content, 'content');
			Validate.languageCode(this.lang, 'lang');
			Validate.value(this.displayInTimeline, 'displayInTimeline');
			Validate.value(this.displayInChapters, 'displayInChapters');
			Validate.value(this.displayOnScreen, 'displayOnScreen');
		}
	}
}