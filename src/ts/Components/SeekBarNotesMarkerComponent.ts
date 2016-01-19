module Player {
	'use strict';
	export class SeekBarNotesMarkerComponent extends VideoJSComponent {
		private _markerData: any[];
		private _markerCounter: JQuery;

		public constructor(player: VideoJSPlayer, videoData: VideoData, data: any) {
			this._markerData = [data];

			super(player, {});

			super.el().style.left = ((data.begin / videoData.dur) * 100) + '%';
			this.on('tap', this.handleClick);
      this.on('click', this.handleClick);
			this.on('mouseup', this.handleClick);
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/SeekBarNotesMarker', {
				mouseText: '1 ' + this.localize('author note')
			}))[0];
		}

		public handleClick(event: Event) {

		}

		public addData(data: any) {

		}
	}
}

videojs.registerComponent('SeekBarNotesMarkerComponent', Player.SeekBarNotesMarkerComponent);