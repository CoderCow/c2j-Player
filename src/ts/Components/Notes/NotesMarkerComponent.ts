module Player {
	'use strict';
	/**
	 * A note marker placed on the player's timeline.
	 * The marker may represent multiple notes by combining them in one menu.
	 */
	export class NotesMarkerComponent extends MenuMarkerComponent {
		private _notes: INoteData[];
		private _isBeingPlayed: boolean;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, note: INoteData) {
			this._notes = [note];

			super(player, {}, videoData, note.begin);

			this._isBeingPlayed = false;
			this.player_.on('timeupdate', this.player_timeUpdate.bind(this));
		}

		/** @inheritdoc */
		public createEl() {
			return $(TemplateUtils.renderSynch('Components/SeekBarNotesMarker', {}))[0];
		}

		/** Adds new note data to this marker. This allows the marker to represent multiple notes at once. */
		public addNote(note: INoteData) {
			this._notes.push(note);
			this.update();
		}

		/** @inheritdoc */
		public createItems(items: any[]) {
			if (items === undefined)
				items = [];

			this._notes.forEach((note: AuthorNoteData) =>
				items.push(new NotesMarkerMenuItemComponent(this.player_, note)));

			return items;
		}

		/** Updates the visual representation of the contained note data. */
		public update() {
			super.update();

			var element: JQuery = $(this.el());
			var title: string;
			if (this._notes.length == 1) {
				title = this._notes[0].title;
				element.removeClass('vjs-icon-file');
				element.addClass('vjs-icon-file-text');
			} else {
				title = this._notes.length + ' ' + this.localize('Hints');
				element.removeClass('vjs-icon-file-text');
				element.addClass('vjs-icon-file');
			}

			element.attr("data-mouse-text", title);
			$(this.menu.el()).find('.vjs-menu-title').text(title);
		}

		/** Visually highlights the marker when the video playback position is close to it. */
		private player_timeUpdate() {
			var primaryNote = this._notes[0];
			var time = this.player_.currentTime();

			if (time >= primaryNote.begin - 4 && time <= primaryNote.begin + 4) {
				if (!this._isBeingPlayed) {
					$(this.el()).addClass('being-played');
					this._isBeingPlayed = true;
				}
			} else if (this._isBeingPlayed) {
				$(this.el()).removeClass('being-played');
				this._isBeingPlayed = false;
			}
		}

		/** Gets the data which are visually represented by this marker. */
		public get notes(): INoteData[] {
			return this._notes;
		}

		/** Gets the video time this marker is placed at. */
		public get time(): number {
			return this._notes[0].begin;
		}
	}
}

videojs.registerComponent('NotesMarkerComponent', Player.NotesMarkerComponent);