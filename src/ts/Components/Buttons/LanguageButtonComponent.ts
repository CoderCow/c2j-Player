module Player {
	'use strict';
	/** The button to open the language menu. */
	export class LanguageButtonComponent extends VideoJSMenuButton {
		private _videoData: VideoData;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData) {
			this._videoData = videoData;

			super(player, {});
		}

		/** @inheritdoc */
		public createEl() {
			return $(TemplateUtils.renderSynch('Components/Buttons/LanguageButton', {
				label: this.localize('Language Menu')
			}))[0];
		}

		/** @inheritdoc */
		public createMenu() {
			return new LanguageMenuComponent(this.player_, this._videoData);
		}
	}
}

videojs.registerComponent('LanguageButtonComponent', Player.LanguageButtonComponent);
