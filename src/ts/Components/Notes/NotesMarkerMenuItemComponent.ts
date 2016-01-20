module Player {
	'use strict';
	export class NotesMarkerMenuItemComponent extends VideoJSMenuItem {
		private _note: AuthorNoteData;

		public constructor(player: VideoJSPlayer, note: AuthorNoteData) {
			super(player, <VideoJSComponentOptions>{ label: 'test item' });

			this._note = note;
		}

		/*public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/NoteMenuItem', {}))[0];
		}*/
	}
}

videojs.registerComponent('NotesMarkerMenuItemComponent', Player.NotesMarkerMenuItemComponent);