module Player {
	'use strict';
	export class AuthorNotesManager {
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		private _authorNoteMarkers: SeekBarNotesMarkerComponent[];

		public constructor(player: VideoJSPlayer, videoData: VideoData, initialLanguage: string) {
			this._player = player;
			this._videoData = videoData;
			this._authorNoteMarkers = null;

			this.setLanguage(initialLanguage);
		}

		public setLanguage(languageCode: string) {
			var authorNotes = this._videoData.authorNotesByLanguage(languageCode);

			// Sort author notes by their beginning time.
			authorNotes.sort((a: AuthorNoteData, b: AuthorNoteData) => a.begin - b.begin);

			if (this._authorNoteMarkers !== null)
				this.removeAllMarkers();

			this._authorNoteMarkers = [];
			this._authorNoteMarkers.length = authorNotes.length;
			authorNotes.forEach((authorNote: AuthorNoteData) => this.setupAuthorNote(authorNote));
		}

		public addAuthorNote(authorNote: AuthorNoteData) {
			this._videoData.authorNotes[authorNote.lang].push(authorNote);
			this.setupAuthorNote(authorNote);
		}

		private setupAuthorNote(authorNote: AuthorNoteData) {
			if (authorNote.displayInTimeline) {
				var existingMarkerAtAboutTheSamePosition = this._authorNoteMarkers.firstOrUndefined((existingMarker: SeekBarNotesMarkerComponent) =>
					(authorNote.begin >= existingMarker.time - 4 && authorNote.end <= existingMarker.time + 4));

				if (existingMarkerAtAboutTheSamePosition !== undefined) {
					existingMarkerAtAboutTheSamePosition.addNote(authorNote);
				} else {
					var noteMarkerComponent = new SeekBarNotesMarkerComponent(this._player, this._videoData, authorNote);
					this._authorNoteMarkers.push(noteMarkerComponent);

					this._player.controlBar.progressControl.seekBar.addChild(noteMarkerComponent);
				}
			}
		}

		public removeAllMarkers() {
			this._authorNoteMarkers.forEach((marker: SeekBarNotesMarkerComponent) => marker.dispose());
			this._authorNoteMarkers = [];
		}
	}
}