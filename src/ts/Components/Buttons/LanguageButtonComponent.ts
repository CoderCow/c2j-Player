module Player {
	'use strict';
	export class LanguageButtonComponent extends VideoJSMenuButton {
		private _videoData: VideoData;

		public constructor(player: VideoJSPlayer, videoData: VideoData) {
			this._videoData = videoData;

			super(player, {});
		}

		public createEl() {
			return $(TemplateUtils.renderSynch('Components/Buttons/LanguageButton', {
				label: this.localize('Language Menu')
			}))[0];
		}

		public createMenu() {
			return new LanguageMenuComponent(this.player_, this._videoData);
		}
	}
}

videojs.registerComponent('LanguageButtonComponent', Player.LanguageButtonComponent);
