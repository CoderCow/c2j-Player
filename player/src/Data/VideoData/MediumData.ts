import { Validate } from './../../Utils/Validate';
import { IValidatable } from './../../Utils/IValidatable';

/**
 * Represents the data of a medium of the video metadata.
 */
export class MediumData implements IValidatable, VideoJSSource {
	/** An absolute or relative url to the medium (video or audio). */
	public src: string;
	/** The media type, such as "video/mp4". */
	public type: string;
	/** IETF language tag. */
	public lang: string;

	/** @inheritdoc */
	public invalidate() {
		Validate.string(this.src, 'src');
		Validate.string(this.type, 'type');
		Validate.languageCode(this.lang, 'lang');
	}
}
