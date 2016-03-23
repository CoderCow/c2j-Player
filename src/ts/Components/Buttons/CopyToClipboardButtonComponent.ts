module Player {
	'use strict';
	/** A button which copies the content of a specific DOM element to the user's clipboard when clicked. */
	export class CopyToClipboardButtonComponent extends VideoJSButton {
		private _elementToCopy: HTMLElement;

		/**
		 * Initializes a new instance of this class.
		 * @param elementToCopy The DOM element to copy the content of.
		 */
		public constructor(player: VideoJSPlayer, options: VideoJSComponentOptions, elementToCopy: HTMLElement) {
			super(player, options);

			this._elementToCopy = elementToCopy;
		}

		/** @inheritdoc */
		public handleClick(event: Event) {
			console.debug('copy button');
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
	}
}

videojs.registerComponent('CopyToClipboardButtonComponent', Player.CopyToClipboardButtonComponent);