module Player {
	'use strict';
	/**
	 * Represents common note data.
	 */
	export interface INoteData {
		/** Start time in seconds (decimal). */
		begin: number;
		/** Duration time in seconds (decimal). */
		dur: number;
		/** End time in seconds (decimal). */
		end: number;
		title: string;
		/** HTML formatted content text. */
		content: string;
		/** IETF language tag. */
		lang: string;
		displayInTimeline: boolean;
		displayInChapters: boolean;
		displayOnScreen: boolean;
	}
}