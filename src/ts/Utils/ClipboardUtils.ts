module Player {
	'use strict';
	export class ClipboardUtils {
		/**
		 * Note: As for chrome, must be called after(!) any user interaction, like a click, has happened. Will always return false otherwise.
		 */
		public static isCopySupported(): boolean {
			var isSelectionApiSupported = (window.getSelection !== undefined);
			var isQueryCommandSupported = (document.queryCommandSupported !== undefined);

			if (isSelectionApiSupported && isQueryCommandSupported) {
				return document.queryCommandSupported('copy');
			} else {
				return false;
			}
		}

		public static copyElementContent(element: HTMLElement): boolean {
			ClipboardUtils.selectElementContent(element);

			var succeeded: boolean;
			try {
        succeeded = document.execCommand('copy');
      } catch (err) {
				console.log(err);
        succeeded = false;
      }

			window.getSelection().removeAllRanges();

			return succeeded;
		}

		public static selectElementContent(element: HTMLElement): string {
			var selectedText: string;

			if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
				var inputElement = <HTMLInputElement>element;
        inputElement.focus();
        inputElement.setSelectionRange(0, inputElement.value.length);

        selectedText = inputElement.value;
	    } else {
        if (element.hasAttribute('contenteditable'))
          element.focus();

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
	    }

			return selectedText;
		}
	}
}