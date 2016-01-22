module Player {
	'use strict';
	export class MarkerMenuComponent extends VideoJSMenu {
		private static _originalInactivityTimeout: number;
		private _hasCapturedMouse: boolean;
		private _linkedMenuButton: VideoJSMenuButton;

		public constructor(player: VideoJSPlayer, linkedMenuButton: VideoJSMenuButton) {
			super(player, {});

			this._hasCapturedMouse = false;
			this._linkedMenuButton = linkedMenuButton;

			// Gonna need this to disable the inactivity timeout while the menu is opened.
			MarkerMenuComponent._originalInactivityTimeout = player.options_.inactivityTimeout;

			this.on('click', EventUtils.noImmediatePropagationAndPreventDefaultHandler);
			this.on('mouseover', (event: MouseEvent) => {
				if (!this._hasCapturedMouse) {
					this.player_.reportUserActivity();

					// The player shall not become inactive while the user is viewing this menu.
					this.player_.options_.inactivityTimeout = 0;
					this._hasCapturedMouse = true;
				}
			});
			this.on('mouseout', (event: MouseEvent) => {
				if (this._hasCapturedMouse) {
					var element = $(document.elementFromPoint(event.x, event.y));
					var mouseMovedOverMenu = (element.closest('.vjs-menu')[0] === this.el());
					if (!mouseMovedOverMenu)
						this._linkedMenuButton.unpressButton();

					// Reset the timeout, so that the player can become inactive again.
					this.player_.options_.inactivityTimeout = MarkerMenuComponent._originalInactivityTimeout;
					this.player_.reportUserActivity();
					this._hasCapturedMouse = false;
				}
			});

			// Don't delegate events to the seekbar.
			this.on('mousemove', EventUtils.noImmediatePropagationHandler);
		}

		public createEl() {
			var element = $(TemplateUtils.renderSynch('Components/SeekBarMarkerMenu', {}));
			this.contentEl_ = element.find('.vjs-menu-content')[0];

			return element[0];
		}

		public addItem(component: VideoJSComponent) {
	    this.addChild(component);

			$(component.el()).find("[data-close-menu='true']").click(() =>
				this._linkedMenuButton.unpressButton());
	  }
	}
}

videojs.registerComponent('MarkerMenuComponent', Player.MarkerMenuComponent);