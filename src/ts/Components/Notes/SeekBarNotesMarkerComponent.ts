module Player {
	'use strict';
	export class SeekBarNotesMarkerComponent extends MarkerMenuButtonComponent {
		private _notes: NoteData[];

		public constructor(player: VideoJSPlayer, videoData: VideoData, note: NoteData) {
			this._notes = [note];

			super(player, {}, videoData, note.begin);
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/SeekBarNotesMarker', {}))[0];
		}

		public addNote(note: NoteData) {
			this._notes.push(note);
			this.update();
		}

		public createItems(items: any[]) {
			if (items === undefined)
				items = [];

			this._notes.forEach((note: AuthorNoteData) =>
				items.push(new NotesMarkerMenuItemComponent(this.player_, note)));

			return items;
		}

		public update() {
			super.update();

			var element: JQuery = $(this.el());
			var title: string;
			if (this._notes.length == 1) {
				title = this.localize('author note');
				element.removeClass('vjs-icon-file');
				element.addClass('vjs-icon-file-text');
			} else {
				title = this._notes.length + ' ' + this.localize('author notes');
				element.removeClass('vjs-icon-file-text');
				element.addClass('vjs-icon-file');
			}

			element.attr("data-mouse-text", title);
			$(this.menu.el()).find('.vjs-menu-title').text(title);
		}

		public get notes(): NoteData[] {
			return this._notes;
		}

		public get time(): number {
			return this._notes[0].begin;
		}
	}
}

videojs.registerComponent('SeekBarNotesMarkerComponent', Player.SeekBarNotesMarkerComponent);