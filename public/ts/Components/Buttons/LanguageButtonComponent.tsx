import { LanguageMenuComponent } from './../Menus/LanguageMenuComponent';
import { ILanguageButtonComponentOptions } from './ILanguageButtonComponentOptions';
import vtreeToDomElement = require('virtual-dom/create-element');

/** The button to open the language menu. */
export class LanguageButtonComponent extends VideoJSMenuButton {
	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, options: ILanguageButtonComponentOptions) {
		super(player, { cjOptions: options });
	}

	/** @inheritdoc */
	public createEl() {
		return vtreeToDomElement(<div className="language-button vjs-button vjs-control vjs-menu-button vjs-menu-button-popup c2j-icon c2j-icon-language"
			tabindex="0"
			title={this.localize('Language Menu')}
			role="button"
			aria-haspopup="true"
			aria-live="polite"
			aria-label={this.localize('Language Menu')}
			aria-pressed="false">
		</div>);
	}

	/** @inheritdoc */
	public createMenu() {
		return new LanguageMenuComponent(this.player_, this.cjOptions().menuOptions);
	}

	public cjOptions(): ILanguageButtonComponentOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('LanguageButtonComponent', LanguageButtonComponent);
