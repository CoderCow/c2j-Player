module Player {
	'use strict';
	export class NotesMarkerMenuItemComponent extends VideoJSMenuItem {
		private _note: AuthorNoteData;

		public constructor(player: VideoJSPlayer, note: AuthorNoteData) {
			this._note = note;

			super(player, {});
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			var el = $(TemplateUtils.renderSynch('Components/NoteMenuItem', {
				title: this._note.title,
				content: this._note.content,
				gotoButtonHint: this.localize('Goto this Position'),
				copyButtonHint: this.localize('Copy to Clipboard')
			}));

			el.find('.note-goto-button').click(() => {
				this.player_.currentTime(this._note.begin);
			});

			var copyButton = el.find('.note-copy-button');
			copyButton.click(() => {
				var contentElement = $(this.el()).find('.note-content');

				var result: boolean = ClipboardUtils.copyElementContent(contentElement[0]);
				if (result) {
					copyButton.addClass('copy-failed');
					copyButton.removeClass('copy-succeeded');
				} else {
					copyButton.addClass('copy-succeeded');
					copyButton.removeClass('copy-failed');
				}

				copyButton.one('mouseout', () => {
					copyButton.removeClass('copy-succeeded');
					copyButton.removeClass('copy-failed');
				});
			});

			return el[0];
		}

		public handleClick() {}
	}
}

videojs.registerComponent('NotesMarkerMenuItemComponent', Player.NotesMarkerMenuItemComponent);