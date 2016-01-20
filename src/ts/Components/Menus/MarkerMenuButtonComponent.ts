module Player {
	'use strict';
	export class MarkerMenuButtonComponent extends VideoJSMenuButton {
		public constructor(player: VideoJSPlayer, options: VideoJSComponentOptions, videoData: VideoData, time: number) {
			super(player, options);

			super.el().style.left = ((time / videoData.dur) * 100) + '%';
			this.update();

			// The seek bar shouldn't start playing at the position of this component.
			this.on('mousedown', EventUtils.noImmediatePropagationHandler);
			this.on('mouseup', EventUtils.noImmediatePropagationHandler);
			this.on('touchstart', EventUtils.noImmediatePropagationHandler);
		}

		public handleClick(event: Event) {
			// When the mouse leaves the button itself, it should switch to unpressed state.
			this.one('mouseout', (event: MouseEvent) => {
				var element = $(document.elementFromPoint(event.x, event.y));
				var mouseMovedOverMenu = (element.closest('.vjs-menu')[0] === this.menu.el());
				if (!mouseMovedOverMenu)
	        this.unpressButton();
	    });

	    if (this.buttonPressed_)
	      this.unpressButton();
	    else
	      this.pressButton();
		}

		public pressButton() {
			super.pressButton();
			$(this.el()).attr('data-hide-mouse-text', 'true');
			$(this.el()).addClass('marker-pressed');
		}

		public unpressButton() {
			super.unpressButton();
			$(this.el()).attr('data-hide-mouse-text', null);
			$(this.el()).removeClass('marker-pressed');
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			var el = $(TemplateUtils.renderSynch('Components/SeekBarNotesMarker', {}));
			el.addClass('vjs-menu-button-popup');

			return el[0];
		}

		public createMenu() {
			var menu = new MarkerMenuComponent(this.player_, this);

			this.items = this.createItems([]);

	    if (this.items)
	      for (var i = 0; i < this.items.length; i++)
	        menu.addItem(this.items[i]);

			return menu;
		}
	}
}

videojs.registerComponent('MarkerMenuButtonComponent', Player.MarkerMenuButtonComponent);