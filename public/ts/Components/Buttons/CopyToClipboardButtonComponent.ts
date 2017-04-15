import { ClipboardUtils } from './../../Utils/ClipboardUtils';
import { ICopyToClipboardButtonComponentOptions} from './ICopyToClipboardButtonComponentOptions';

/** A button which copies the content of a specific DOM element to the user's clipboard when clicked. */
export class CopyToClipboardButtonComponent extends VideoJSButton {
	private _elementToCopy: HTMLElement;

	/**
	 * Initializes a new instance of this class.
	 */
	public constructor(player: VideoJSPlayer, options: ICopyToClipboardButtonComponentOptions) {
		super(player, { cjOptions: options });

		this._elementToCopy = options.elementToCopy;
	}

	/** @inheritdoc */
	public handleClick(event: Event) {
		var buttonElement = $(this.el());
		
		var result: boolean = ClipboardUtils.copyElementContent(this._elementToCopy);
		if (result) {
			buttonElement.addClass('copy-failed');
			buttonElement.removeClass('copy-succeeded');
		} else {
			buttonElement.addClass('copy-succeeded');
			buttonElement.removeClass('copy-failed');
		}

		buttonElement.one('mouseout', () => {
			buttonElement.removeClass('copy-succeeded');
			buttonElement.removeClass('copy-failed');
		});

		super.handleClick(event);
	}

	public cjOptions(): ICopyToClipboardButtonComponentOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('CopyToClipboardButtonComponent', CopyToClipboardButtonComponent);
