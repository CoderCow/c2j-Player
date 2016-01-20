module Player {
	'use strict';
	export class MarkerMenuComponent extends VideoJSMenu {
		public constructor(player: VideoJSPlayer, linkedMenuButton: VideoJSMenuButton) {
			super(player, {});

			this.on('click', EventUtils.noImmediatePropagationAndPreventDefaultHandler);
			this.on('mouseout', (event: MouseEvent) => {
				var element = $(document.elementFromPoint(event.x, event.y));
				var mouseMovedOverMenu = (element.closest('.vjs-menu')[0] === this.el());
				if (!mouseMovedOverMenu)
					linkedMenuButton.unpressButton();
			});

			// Don't delegate events to the seekbar.
			this.on('mousemove', EventUtils.noImmediatePropagationHandler);
		}

		public createEl() {
			var element = $(TemplateUtils.renderSynch('Components/SeekBarMarkerMenu', {}));
			this.contentEl_ = element.find('.vjs-menu-content')[0];

			return element[0];
		}
	}
}

videojs.registerComponent('MarkerMenuComponent', Player.MarkerMenuComponent);