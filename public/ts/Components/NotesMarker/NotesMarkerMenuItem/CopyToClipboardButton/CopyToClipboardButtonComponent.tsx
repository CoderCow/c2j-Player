import { ClipboardUtils } from './../../../../Utils/ClipboardUtils';
import { ICopyToClipboardButtonOptions } from './ICopyToClipboardButtonOptions';
import vtreeToDomElement = require('virtual-dom/create-element');

/** A button which copies the content of a specific DOM element to the user's clipboard when clicked. */
export class CopyToClipboardButtonComponent extends VideoJSButton {
	private _elementToCopy: HTMLElement;

	/**
	 * Initializes a new instance of this class.
	 */
	public constructor(player: VideoJSPlayer, options: ICopyToClipboardButtonOptions) {
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

	public createEl(tagName: string, properties?: any, attributes?: any) {
		{/* The copy button will get class 'vjs-hidden', if the Clipboard API is not available.
				It will also get the 'copy-failed' or 'copy-succeeded' classes accordingly. */}
		return vtreeToDomElement(
			<div className="note-copy-button c2j-icon c2j-icon-clipboard" 
			     title={this.localize('Copy to Clipboard')} 
					 tabIndex="1" 
					 data-closemenu="true">
		  </div>);
	}

	public cjOptions(): ICopyToClipboardButtonOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('CopyToClipboardButtonComponent', CopyToClipboardButtonComponent);
