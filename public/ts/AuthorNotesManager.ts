import { INotesMarkerComponentOptions } from './Components/Notes/INotesMarkerComponentOptions';
import { AuthorNoteData } from './Data/VideoData/AuthorNoteData';
import { NotesMarkerComponent } from './Components/Notes/NotesMarkerComponent';
import { VideoData } from './Data/VideoData/VideoData';

/**
 * Maintains multilingual author notes and their markers on the timeline.
 */
export class AuthorNotesManager {
	private _player: VideoJSPlayer;
	private _videoData: VideoData;
	private _authorNoteMarkers?: NotesMarkerComponent[];

	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, videoData: VideoData, initialLanguage: string) {
		this._player = player;
		this._videoData = videoData;

		this.setLanguage(initialLanguage);
	}

	/** Removes all current author notes and applies those of the given language. */
	public setLanguage(languageCode: string) {
		var authorNotes = this._videoData.authorNotesByLanguage(languageCode);

		// Sort author notes by their beginning time.
		authorNotes.sort((a: AuthorNoteData, b: AuthorNoteData) => a.begin - b.begin);

		if (this._authorNoteMarkers !== null)
			this.removeAllMarkers();

		this._authorNoteMarkers = [];
		authorNotes.forEach((authorNote: AuthorNoteData) => this.setupAuthorNote(authorNote));
	}

	/** Adds a new (custom) author note. */
	public addAuthorNote(authorNote: AuthorNoteData) {
		this._videoData.authorNotes[authorNote.lang].push(authorNote);
		this.setupAuthorNote(authorNote);
	}

	/**
	 * Creates a new timeline marker for the given author note if necessary.
	 * If author notes are time-wise close to each other, they are grouped into one marker.
	 */
	private setupAuthorNote(authorNote: AuthorNoteData) {
		if (!this._authorNoteMarkers)
			throw new Error('Author notes were not loaded yet.');

		if (authorNote.displayInTimeline) {
			var existingMarkerAtAboutTheSamePosition = this._authorNoteMarkers.find((existingMarker: NotesMarkerComponent) =>
				(authorNote.begin >= existingMarker.time - 4 && authorNote.begin <= existingMarker.time + 4));

			if (existingMarkerAtAboutTheSamePosition !== undefined) {
				existingMarkerAtAboutTheSamePosition.addNote(authorNote);
			} else {
				var noteMarkerComponent = new NotesMarkerComponent(this._player, <INotesMarkerComponentOptions>{
					videoData: this._videoData,
					notes: [authorNote],
					time: authorNote.begin
				});
				this._authorNoteMarkers.push(noteMarkerComponent);

				//this._player.controlBar.progressControl.addChild(noteMarkerComponent);
				this._player.controlBar.progressControl.seekBar.addChild(noteMarkerComponent);
			}
		}
	}

	/** Removes all author note markers from the player's timeline. */
	public removeAllMarkers() {
		if (!this._authorNoteMarkers)
			return;

		this._authorNoteMarkers.forEach((marker: NotesMarkerComponent) => marker.dispose());
		this._authorNoteMarkers = [];
	}
}
