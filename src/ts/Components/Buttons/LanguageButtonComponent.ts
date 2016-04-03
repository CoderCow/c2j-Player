module Player {
	'use strict';
	/** The button to open the language menu. */
	export class LanguageButtonComponent extends VideoJSMenuButton {
		private _videoData: VideoData;
		private _isSimpleMenuMode: boolean;
		private _initialMediaLanguage: string;
		private _initialAdditionalsLanguage: string;
		private _initialSubtitleLanguage: string;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, isSimpleMenuMode: boolean, initialMediaLanguage: string, initialAdditionalsLanguage: string, initialSubtitleLanguage: string) {
			this._videoData = videoData;
			this._isSimpleMenuMode = isSimpleMenuMode;
			this._initialMediaLanguage = initialMediaLanguage;
			this._initialAdditionalsLanguage = initialAdditionalsLanguage;
			this._initialSubtitleLanguage = initialSubtitleLanguage;

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
			return new LanguageMenuComponent(this.player_, this._videoData, this._isSimpleMenuMode, this._initialMediaLanguage, this._initialAdditionalsLanguage, this._initialSubtitleLanguage);
		}
	}
}

videojs.registerComponent('LanguageButtonComponent', Player.LanguageButtonComponent);
