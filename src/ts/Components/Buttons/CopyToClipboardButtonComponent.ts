module Player {
	'use strict';
	export class CopyToClipboardButtonComponent extends VideoJSButton {
		private _elementToCopy: HTMLElement;

		public constructor(player: VideoJSPlayer, options: VideoJSComponentOptions, elementToCopy: HTMLElement) {
			super(player, options);

			this._elementToCopy = elementToCopy;
		}

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