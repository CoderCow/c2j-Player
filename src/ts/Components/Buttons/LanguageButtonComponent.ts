module Player {
	'use strict';

	/** The button to open the language menu. */
	export class LanguageButtonComponent extends VideoJSMenuButton {
		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, options: ILanguageButtonComponentOptions) {
			super(player, { cjOptions: options });
		}

		/** @inheritdoc */
		public createEl() {
			return $(TemplateUtils.renderSynch('Components/Buttons/LanguageButton', {
				label: this.localize('Language Menu')
			}))[0];
		}

		/** @inheritdoc */
		public createMenu() {
			return new LanguageMenuComponent(this.player_, this.cjOptions().menuOptions);
		}

		public cjOptions(): ILanguageButtonComponentOptions {
			return super.options().cjOptions;
		}
	}
}

videojs.registerComponent('LanguageButtonComponent', Player.LanguageButtonComponent);
