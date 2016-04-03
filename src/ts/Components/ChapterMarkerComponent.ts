module Player {
	'use strict';
	/** A chapter marker placed on the player's timeline. */
	export class ChapterMarkerComponent extends VideoJSComponent {
		private _chapterData: ChapterData;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, chapterData: ChapterData) {
			this._chapterData = chapterData;

			super(player, {});

			super.el().style.left = ((chapterData.begin / videoData.dur) * 100) + '%';
			this.on('tap', this.handleClick);
      this.on('click', this.handleClick);
			this.on('mouseup', this.handleClick);
			this.on('mousedown', this.handleMouseDown);
			this.on('keydown', this.handleKeyPress);
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/SeekBarChapterMarker', {
				mouseText: this._chapterData.title
			}))[0];
		}

		/** Handles the marker's click event. Changes the playback position to the position of the marker. */
		public handleClick(event: Event) {
			this.player_.currentTime(this._chapterData.begin);
			this.el().blur();

			event.stopImmediatePropagation();
		}

		/** @inheritdoc */
		public handleMouseDown(event: Event) {
			event.stopImmediatePropagation();
		}

		/** @inheritdoc */
		public handleKeyPress(event: KeyboardEvent) {
	    // Check for space bar (32) or enter (13) keys
	    if (event.which === 32 || event.which === 13) {
	      event.preventDefault();
	      this.handleClick(event);
	    }
	  }

		/** Gets the data which are visually represented by this marker. */
		public get chapterData(): ChapterData {
			return this._chapterData;
		}
	}
}

videojs.registerComponent('ChapterMarkerComponent', Player.ChapterMarkerComponent);