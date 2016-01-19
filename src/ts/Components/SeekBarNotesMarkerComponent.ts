module Player {
	'use strict';
	export class SeekBarNotesMarkerComponent extends VideoJSComponent {
		private _notes: NoteData[];

		public constructor(player: VideoJSPlayer, videoData: VideoData, note: NoteData) {
			this._notes = [note];

			super(player, {});

			super.el().style.left = ((note.begin / videoData.dur) * 100) + '%';
			this.on('tap', this.handleClick);
      this.on('click', this.handleClick);
			this.on('mouseup', this.handleClick);
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/SeekBarNotesMarker', {
				mouseText: this.localize('author note')
			}))[0];
		}

		public handleClick(event: Event) {

		}

		public addNote(note: NoteData) {
			this._notes.push(note);

			var element: JQuery = $(this.el());
			element.removeClass('vjs-icon-file-text');
			element.addClass('vjs-icon-file');
			element.attr("data-mouse-text", this._notes.length + ' ' + this.localize('author notes'));
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