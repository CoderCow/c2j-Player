module Player {
	'use strict';
	/** The mouse popup, visible when the user moves the cursor above the video timeline. */
	export class MouseTimeDisplayComponent extends VideoJSComponent {
		private _videoData: VideoData;
		private _isHidden: boolean;

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData) {
			super(player, {});

			this._videoData = videoData;
			player.on('mousemove', videojs.bind(this, this.handleMouseMove)); //throttle(videojs.bind(this, this.handleMouseMove), 25));
		}

		/** @inheritdoc */
		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/MouseTimeDisplay', {}))[0];
		}

		/**
		 * Handles the mouse move event of the player. Updates the DOM element where the cursor points at.
		 */
		private handleMouseMove(event: MouseEvent) {
	    var duration = this.player_.duration();
	    var newTime = this.calculateDistance(event) * duration;
			var position = event.pageX - $(this.el().parentNode).offset().left;

			var pointElement: any = document.elementFromPoint(event.clientX, event.clientY);
	    this.update(newTime, position, pointElement);
	  }

		/**
		 * Updates the visibility of this popup and the given element's "data-current-time" attribute (which is displayed as
		 * the popup's content text via CSS).
		 */
	  private update(newTime: number, position: number, pointElement: Element) {
		  var shouldShowMouseText = (pointElement.getAttribute("data-hide-mouse-text") === null);
		  if (pointElement !== undefined && shouldShowMouseText) {
			  var tooltipString: string;
				tooltipString = pointElement.getAttribute("data-mouse-text");
			  if (tooltipString === null)
			    tooltipString = videojs.formatTime(newTime, this.player_.duration());

			  this.el().setAttribute('data-current-time', tooltipString);
	      this.el().style.left = position + 'px';
			  if (tooltipString.length <= 5)
				  $(this.el()).addClass('simple');
			  else
				  $(this.el()).removeClass('simple');

			  if (this._isHidden) {
			    $(this.el()).removeClass('vjs-hidden');
				  this._isHidden = false;
			  }
		  } else if (!this._isHidden) {
			  $(this.el()).addClass('vjs-hidden');
			  this._isHidden = true;
		  }
	  }

		/**
		 * Uses the given mouse move event object to calculate the position of the cursor inside the element as a percentage value.
		 * e.g. if the cursor is located in the center of the element, this function will return 0.5.
		 */
	  private calculateDistance(event: MouseEvent) {
		  var element = this.el().parentNode;
	    var x = $(element).offset().left;

		  return Math.max(0, Math.min(1, (event.pageX - x) / element.offsetWidth));
	  }
	}
}

videojs.registerComponent('MouseTimeDisplayComponent', Player.MouseTimeDisplayComponent);