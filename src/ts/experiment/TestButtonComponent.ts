module Player {
	'use strict';
	export class TestButtonComponent extends VideoJSButton {
		public constructor(player?: VideoJSPlayer, options?: VideoJSComponentOptions) {
			super(player, options);
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