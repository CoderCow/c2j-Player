module Player {
	'use strict';
	/** A generic timeline marker with a deposited menu. */
	export class MenuMarkerComponent extends VideoJSMenuButton {
		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, options: VideoJSComponentOptions, videoData: VideoData, time: number) {
			super(player, options);

			super.el().style.left = ((time / videoData.dur) * 100) + '%';
			this.update();

			// Stop event propagation, so that the seek bar (behind the marker) will not change the playback position.
			this.on('mousedown', EventUtils.noImmediatePropagationHandler);
			this.on('mouseup', EventUtils.noImmediatePropagationHandler);
			this.on('touchstart', EventUtils.noImmediatePropagationHandler);
		}

		/** @inheritdoc */
		public handleClick(event: Event) {
			// When the mouse leaves the button itself, the button should switch to unpressed state.
			this.one('mouseout', (event: MouseEvent) => {
				var element = $(document.elementFromPoint(event.clientX, event.clientY));
				var mouseMovedOverMenu = (element.closest('.vjs-menu')[0] === this.menu.el());
				if (!mouseMovedOverMenu)
	        this.unpressButton();
	    });

	    if (this.buttonPressed_)
	      this.unpressButton();
	    else
	      this.pressButton();
		}

		/** @inheritdoc */
		public pressButton() {
			super.pressButton();
			$(this.el()).attr('data-hide-mouse-text', 'true');
			$(this.el()).addClass('marker-pressed');
		}

		/** @inheritdoc */
		public unpressButton() {
			super.unpressButton();
			$(this.el()).attr('data-hide-mouse-text', null);
			$(this.el()).removeClass('marker-pressed');
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			var el = $(TemplateUtils.renderSynch('Components/SeekBarNotesMarker', {}));
			el.addClass('vjs-menu-button-popup');

			return el[0];
		}

		/** @inheritdoc */
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

videojs.registerComponent('MenuMarkerComponent', Player.MenuMarkerComponent);