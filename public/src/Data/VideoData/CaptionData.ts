import { Validate } from './../../Utils/Validate';
import { IValidatable } from './../../Utils/IValidatable';

/**
 * Represents the data of caption (subtitle) text of the video metadata.
 */
export class CaptionData implements IValidatable {
	/** Start time in seconds (decimal). */
	public begin: number;
	/** Duration time in seconds (decimal). */
	public dur: number;
	/** End time in seconds (decimal). */
	public end: number;
	/** HTML formatted content text. */
	public content: string;
	/** IETF language tag. */
	public lang: string;

	/** @inheritdoc */
	public invalidate(): void {
		Validate.number(this.begin, 'begin', 0);
		Validate.number(this.dur, 'dur', 0);
		Validate.number(this.end, 'end', 0);
		Validate.string(this.content, 'content');
		Validate.string(this.lang, 'lang');
	}
}
