module Player {
	'use strict';
	export class ChapterMarkerComponent extends VideoJSComponent {
		private _chapterData: ChapterData;

		public constructor(player: VideoJSPlayer, videoData: VideoData, chapterData: ChapterData) {
			this._chapterData = chapterData;

			super(player, {});

			super.el().style.left = ((chapterData.begin / videoData.dur) * 100) + '%';
			this.on('tap', this.handleClick);
      this.on('click', this.handleClick);
			this.on('mouseup', this.handleClick);
			this.on('mousedown', this.handleMouseDown);
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/SeekBarChapterMarker', {
				mouseText: this._chapterData.title
			}))[0];
		}

		public handleClick(event: Event) {
			this.player_.currentTime(this._chapterData.begin);
			event.stopImmediatePropagation();
		}

		public handleMouseDown(event: Event) {
			event.stopImmediatePropagation();
		}

		public get chapterData(): ChapterData {
			return this._chapterData;
		}
	}
}

videojs.registerComponent('ChapterMarkerComponent', Player.ChapterMarkerComponent);