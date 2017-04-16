
import { EventUtils } from './../../Utils/EventUtils';
import { MarkerMenuComponent } from './MarkerMenu';
import { IMenuMarkerOptions } from './IMenuMarkerOptions';
import vtreeToDomElement = require('virtual-dom/create-element');

/** A generic timeline marker with a deposited menu. */
export class MenuMarkerComponent extends VideoJSMenuButton {
	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, options: IMenuMarkerOptions) {
		super(player, { cjOptions: options });

		super.el().style.left = ((options.time / options.videoData.dur) * 100) + '%';
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
		this.arrangeMenu();

		super.pressButton();

		this.player_.reportUserActivity();
		$('.vjs-mouse-display').addClass('vjs-hidden');
		//$(this.el()).attr('data-hide-mousetext', 'true');
		$(this.el()).addClass('marker-pressed');
	}

	/** @inheritdoc */
	public unpressButton() {
		super.unpressButton();
		$('.vjs-mouse-display').removeClass('vjs-hidden');
		//$(this.el()).attr('data-hide-mousetext', null);
		$(this.el()).removeClass('marker-pressed');
	}

	/** Position the menu so that it doesn't exceed the player's boundaries. */
	private arrangeMenu() {
		var playerWidth = $(this.player().el()).width();
		var menuElement = $(this.menu.el());
		var buttonX = $(this.el()).offset().left;
		var menuWidth = menuElement.width();
		var menuRight = buttonX + menuWidth;

		if (menuRight > playerWidth)
			menuElement.css('left', '-' + (menuRight - playerWidth).toString() + 'px');
	}

	/** @inheritdoc */
	public createEl(tagName: string, properties?: any, attributes?: any) {
		return vtreeToDomElement(<div className="seek-bar-marker note-marker vjs-menu-button-popup" tabindex="1"></div>);
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

	public cjOptions(): IMenuMarkerOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('MenuMarkerComponent', MenuMarkerComponent);
