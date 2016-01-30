module Player {
	'use strict';
	export class NotesMarkerComponent extends MenuMarkerComponent {
		private _notes: NoteData[];
		private _isBeingPlayed: boolean;

		public constructor(player: VideoJSPlayer, videoData: VideoData, note: NoteData) {
			this._notes = [note];

			super(player, {}, videoData, note.begin);

			this._isBeingPlayed = false;
			this.player_.on('timeupdate', this.player_timeUpdate.bind(this));
		}

		public createEl() {
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
				title = this.localize('Author Note');
				element.removeClass('vjs-icon-file');
				element.addClass('vjs-icon-file-text');
			} else {
				title = this._notes.length + ' ' + this.localize('Author Notes');
				element.removeClass('vjs-icon-file-text');
				element.addClass('vjs-icon-file');
			}

			element.attr("data-mouse-text", title);
			$(this.menu.el()).find('.vjs-menu-title').text(title);
		}

		public pressButton() {
			super.pressButton();

			// Because this must be called after a user interaction has happened.
			if (!ClipboardUtils.isCopySupported())
				$(this.el()).find('.note-copy-button').addClass('vjs-hidden');
		}

		private player_timeUpdate() {
			var primaryNote = this._notes[0];
			var time = this.player_.currentTime();

			if (time >= primaryNote.begin - 4 && time <= primaryNote.end + 4) {
				if (!this._isBeingPlayed)
					$(this.el()).addClass('being-played');
			} else if (this._isBeingPlayed) {
				$(this.el()).removeClass('being-played');
			}
		}

		public get notes(): NoteData[] {
			return this._notes;
		}

		public get time(): number {
			return this._notes[0].begin;
		}
	}
}

videojs.registerComponent('NotesMarkerComponent', Player.NotesMarkerComponent);