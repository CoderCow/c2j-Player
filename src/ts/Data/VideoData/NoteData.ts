module Player {
	'use strict';
	export interface NoteData {
		begin: number;
		dur: number;
		end: number;
		title: string;
		content: string;
		lang: string;
		displayInTimeline: boolean;
		displayInChapters: boolean;
		displayOnScreen: boolean;
	}
}