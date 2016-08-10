module Player {
	'use strict';
	export class TestButtonComponent extends VideoJSButton {
		public constructor(player?: VideoJSPlayer, options?: VideoJSComponentOptions|any) {
			super(player, options);
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return super.createEl(undefined, {}, {
				title: this.localize('Settings')
			});
		}

		public buildCSSClass() {
	    return `vjs-testbutton-control vjs-icon-cog ${super.buildCSSClass()}`;
	  }

		public handleClick() {
			alert("TestButtonComponent was clicked!");
		}
	}
}

videojs.registerComponent('TestButtonComponent', Player.TestButtonComponent);