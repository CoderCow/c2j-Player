module Player {
	'use strict';
	/** A menu item of a note marker menu. */
	export class NotesMarkerMenuItemComponent extends VideoJSMenuItem {
		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, options: INotesMarkerMenuItemComponentOptions) {
			super(player, { cjOptions: options });

			var elementToCopy = $(this.el()).find('.note-content')[0];
			new CopyToClipboardButtonComponent(this.player_, <ICopyToClipboardButtonComponentOptions>{
				el: $(this.el()).find('.note-copy-button')[0],
				elementToCopy: elementToCopy
			});

			new GoToPositionButtonComponent(this.player_, <IGoToPositionButtonComponentOptions>{
				el: $(this.el()).find('.note-goto-button')[0],
				goToPosition: options.note.begin
			});
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			// TODO: format content like _blank on all <a>, make beautiful anchors with a symbol, convert links to <a>'s, format code etc.
			var el = $(TemplateUtils.renderSynch('Components/Menus/NoteMenuItem', {
				title: this.cjOptions().note.title,
				content: this.cjOptions().note.content,
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

		public cjOptions(): INotesMarkerMenuItemComponentOptions {
			return super.options().cjOptions;
		}
	}
}

videojs.registerComponent('NotesMarkerMenuItemComponent', Player.NotesMarkerMenuItemComponent);