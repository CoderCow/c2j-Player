module Player {
	'use strict';
	/** A chapter marker placed on the player's timeline. */
	export class ChapterMarkerComponent extends VideoJSComponent {
		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, options: IChapterMarkerComponentOptions) {
			super(player, { cjOptions: options });

			super.el().style.left = ((options.chapterData.begin / options.videoData.dur) * 100) + '%';
			this.on('tap', this.handleClick);
      this.on('click', this.handleClick);
			this.on('mouseup', this.handleClick);
			this.on('mousedown', this.handleMouseDown);
			this.on('keydown', this.handleKeyPress);
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/SeekBarChapterMarker', {
				mouseText: this.cjOptions().chapterData.title
			}))[0];
		}

		/** Handles the marker's click event. Changes the playback position to the position of the marker. */
		public handleClick(event: Event) {
			this.player_.currentTime(this.cjOptions().chapterData.begin);
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
			return this.cjOptions().chapterData;
		}

		public cjOptions(): IChapterMarkerComponentOptions {
			return super.options().cjOptions;
		}
	}
}

videojs.registerComponent('ChapterMarkerComponent', Player.ChapterMarkerComponent);