module Player {
	'use strict';
	/** A menu item of a note marker menu. */
	export class NotesMarkerMenuItemComponent extends VideoJSMenuItem {
		private _note: AuthorNoteData;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, note: AuthorNoteData) {
			this._note = note;

			super(player, {});

			var elementToCopy = $(this.el()).find('.note-content')[0];
			new CopyToClipboardButtonComponent(this.player_, {
				el: $(this.el()).find('.note-copy-button')[0]
			}, elementToCopy);

			var goToTime = this._note.begin;
			new GoToPositionButtonComponent(this.player_, {
				el: $(this.el()).find('.note-goto-button')[0]
			}, goToTime);
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			// TODO: format content like _blank on all <a>, make beautiful anchors with a symbol, convert links to <a>'s, format code etc.
			var el = $(TemplateUtils.renderSynch('Components/Menus/NoteMenuItem', {
				title: this._note.title,
				content: this._note.content,
				gotoButtonHint: this.localize('Go to this Position'),
				copyButtonHint: this.localize('Copy to Clipboard')
			}));

			/*el.find('.note-goto-button').click(() => {
				this.player_.currentTime(this._note.begin);
			});

			var copyButton = el.find('.note-copy-button');
			copyButton.click(() => {
				var contentElement = $(this.el()).find('.note-content');


			});*/

			return el[0];
		}

		/** @inheritdoc */
		public handleClick(event: Event) {
			event.stopPropagation();
		}
	}
}

videojs.registerComponent('NotesMarkerMenuItemComponent', Player.NotesMarkerMenuItemComponent);