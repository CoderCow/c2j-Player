module Player {
	'use strict';
	export class SeekBarChapterMarkerComponent extends VideoJSComponent {
		private _chapterData: ChapterData;

		public constructor(player: VideoJSPlayer, videoData: VideoData, chapterData: ChapterData) {
			this._chapterData = chapterData;

			super(player, {});

			super.el().style.left = ((chapterData.begin / videoData.dur) * 100) + '%';
			this.on('tap', this.handleClick);
      this.on('click', this.handleClick);
			this.on('mouseup', this.handleClick);
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return super.createEl(undefined, {
				className: 'seek-bar-marker vjs-icon-circle'
			}, {
				title: (this._chapterData.tooltip !== '' ? this._chapterData.tooltip : this._chapterData.title)
			});
		}

		public handleClick(event: Event) {
			this.player_.currentTime(this._chapterData.begin);
		}

		public get chapterData(): ChapterData {
			return this._chapterData;
		}
	}
}

videojs.registerComponent('SeekBarChapterMarkerComponent', Player.SeekBarChapterMarkerComponent);