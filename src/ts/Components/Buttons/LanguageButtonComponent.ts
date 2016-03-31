module Player {
	'use strict';
	/** The button to open the language menu. */
	export class LanguageButtonComponent extends VideoJSMenuButton {
		private _videoData: VideoData;
		private _isSimpleMenuMode: boolean;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, isSimpleMenuMode: boolean) {
			this._videoData = videoData;
			this._isSimpleMenuMode = isSimpleMenuMode;

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
			return new LanguageMenuComponent(this.player_, this._videoData, this._isSimpleMenuMode);
		}
	}
}

videojs.registerComponent('LanguageButtonComponent', Player.LanguageButtonComponent);
