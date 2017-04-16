import { Validate } from './../../Utils/Validate';
import { IValidatable } from './../../Utils/IValidatable';
import { INoteData } from './INoteData';

/**
 * Represents the data of a author note of the video metadata.
 */
export class AuthorNoteData implements INoteData, IValidatable {
	/** Start time in seconds (decimal). */
	public begin: number;
	/** Duration time in seconds (decimal). */
	public dur: number;
	/** End time in seconds (decimal). */
	public end: number;
	public title: string;
	/** HTML formatted content text. */
	public content: string;
	/** IETF language tag. */
	public lang: string;
	public displayInTimeline: boolean;
	public displayInChapters: boolean;
	public displayOnScreen: boolean;

	/** @inheritdoc */
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
