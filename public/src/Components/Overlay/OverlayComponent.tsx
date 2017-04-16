import { OverlayData, OverlayAction, GotoActionParamsData, LinkActionParamsData } from './../../Data/VideoData/OverlayData';
import { IOverlayOptions } from './IOverlayOptions';
import vtreeToDomElement = require('virtual-dom/create-element');
require('./overlay.scss');

/** Represents a visual, interactible overlay. */
export class OverlayComponent extends VideoJSButton {
	private _isVisible: boolean;
	private _isPausing: boolean;

	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, options: IOverlayOptions) {
		super(player, { cjOptions: options });

		var element: HTMLElement = this.el();
		element.style.position = 'absolute';
		element.style.left = element.style.right = (50 - options.overlayData.w / 2) + '%';
		element.style.top = element.style.bottom = (50 - options.overlayData.h / 2) + '%';
		element.style.transform =
			'translate(' + ((options.overlayData.translateTransform.x / options.overlayData.w) * 100) + '%,' + ((options.overlayData.translateTransform.y / options.overlayData.h) * 100) + '%) ' +
			'rotateX(-' + options.overlayData.rotateTransform.x + 'rad) ' +
			'rotateY(-' + options.overlayData.rotateTransform.y + 'rad) ' +
			'rotateZ(-' + options.overlayData.rotateTransform.z + 'rad) ';

		if (options.overlayData.action === OverlayAction.None)
			element.style.pointerEvents = 'none';
		else
			element.style.pointerEvents = 'all';

		this.hide();
	}

	/** @inheritdoc */
	public createEl(tagName: string, properties?: any, attributes?: any) {
		let overlay = this.cjOptions().overlayData;

		// TODO: format content like _blank on all <a>, make beautiful anchors with a symbol, convert links to <a>'s, format code etc.
		// gets class 'is-pausing' when the overlay is currently pausing the video playback
		var vTree = <div className="overlay" title={overlay.tooltip}></div>;
		// Content can contain p, b, i, span elements (as provided by Camtasia2Json)
		(vTree as any).innerHTML = overlay.content;

		return vtreeToDomElement(vTree);
	}

	/** @inheritdoc */
	public handleClick() {
		let overlay = this.cjOptions().overlayData;

		switch (overlay.action) {
			case OverlayAction.GotoPos: {
				var goToParams = overlay.actionParams as GotoActionParamsData;
				this.player_.currentTime(goToParams.gotoPos);
				this.player_.play();

				break;
			}
			case OverlayAction.OpenLink: {
				var openLinkParams = overlay.actionParams as LinkActionParamsData;
				var target = '';
				if (openLinkParams.inNewWindow)
					target = '_blank';

				window.open(openLinkParams.href, target);
				this.player_.pause();

				break;
			}
			case OverlayAction.ContinueOnClick: {
				this.player_.play();

				break;
			}
		}
	}

	/** @inheritdoc */
	public show(): VideoJSComponent {
		super.show();
		this._isVisible = true;

		return this;
	}

	/** @inheritdoc */
	public hide(): VideoJSComponent {
		super.hide();
		this._isVisible = false;

		return this;
	}

	/** Gets the data which are visually represented by this overlay. */
	public get overlay(): OverlayData {
		return this.cjOptions().overlayData;
	}

	/** Gets whether this overlay is currently visible or not. */
	public get isVisible(): boolean {
		return this._isVisible;
	}

	/** Gets whether this overlay is currently pausing the video or not. */
	public get isPausing(): boolean {
		return this._isPausing;
	}

	/** Sets whether this overlay is currently pausing the video or not. */
	public set isPausing(value: boolean) {
		if (value)
			$(this.el()).addClass('is-pausing');
		else
			$(this.el()).removeClass('is-pausing');

		this._isPausing = value;
	}

	public cjOptions(): IOverlayOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('OverlayComponent', OverlayComponent);
