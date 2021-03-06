module Player {
	'use strict';
	/** Represents a visual, interactible overlay. */
	export class OverlayComponent extends VideoJSButton {
		private _overlay: OverlayData;
		private _isVisible: boolean;
		private _isPausing: boolean;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, overlay: OverlayData) {
			this._overlay = overlay;

			super(player, {});

			var element: HTMLElement = this.el();
			element.style.position = 'absolute';
			element.style.left = element.style.right = (50 - this._overlay.w / 2) + '%';
			element.style.top = element.style.bottom = (50 - this._overlay.h / 2) + '%';
			element.style.transform =
				'translate(' + ((this._overlay.translateTransform.x / this._overlay.w) * 100) + '%,' + ((this._overlay.translateTransform.y / this._overlay.h) * 100) + '%) ' +
				'rotateX(-' + this._overlay.rotateTransform.x + 'rad) ' +
				'rotateY(-' + this._overlay.rotateTransform.y + 'rad) ' +
				'rotateZ(-' + this._overlay.rotateTransform.z + 'rad) ';

			if (this._overlay.action === OverlayAction.None)
				element.style.pointerEvents = 'none';
			else
				element.style.pointerEvents = 'all';

			this.hide();
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			// TODO: format content like _blank on all <a>, make beautiful anchors with a symbol, convert links to <a>'s, format code etc.
			return $(TemplateUtils.renderSynch('Components/Overlay', {
				content: this._overlay.content,
				isClickable: (this._overlay.action !== OverlayAction.None),
				tooltip: this._overlay.tooltip
			}))[0];
		}

		/** @inheritdoc */
		public handleClick() {
			switch (this._overlay.action) {
				case OverlayAction.GotoPos: {
					var goToParams = <GotoActionParamsData>this._overlay.actionParams;
					this.player_.currentTime(goToParams.gotoPos);
					this.player_.play();

					break;
				}
				case OverlayAction.OpenLink: {
					var openLinkParams = <LinkActionParamsData>this._overlay.actionParams;
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
			return this._overlay;
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
	}
}

videojs.registerComponent('OverlayComponent', Player.OverlayComponent);