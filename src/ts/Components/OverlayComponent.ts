module Player {
	'use strict';
	/** Represents a visual, interactible overlay. */
	export class OverlayComponent extends VideoJSButton {
		private _isVisible: boolean;
		private _isPausing: boolean;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, options: IOverlayComponentOptions) {
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
			return $(TemplateUtils.renderSynch('Components/Overlay', {
				content: overlay.content,
				isClickable: (overlay.action !== OverlayAction.None),
				tooltip: overlay.tooltip
			}))[0];
		}

		/** @inheritdoc */
		public handleClick() {
			let overlay = this.cjOptions().overlayData;

			switch (overlay.action) {
				case OverlayAction.GotoPos: {
					var goToParams = <GotoActionParamsData>overlay.actionParams;
					this.player_.currentTime(goToParams.gotoPos);
					this.player_.play();

					break;
				}
				case OverlayAction.OpenLink: {
					var openLinkParams = <LinkActionParamsData>overlay.actionParams;
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

		public cjOptions(): IOverlayComponentOptions {
			return super.options().cjOptions;
		}
	}
}

videojs.registerComponent('OverlayComponent', Player.OverlayComponent);