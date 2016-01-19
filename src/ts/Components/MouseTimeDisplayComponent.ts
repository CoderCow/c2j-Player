module Player {
	'use strict';
	export class MouseTimeDisplayComponent extends VideoJSComponent {
		private _videoData: VideoData;

		public constructor(player: VideoJSPlayer, videoData: VideoData) {
			super(player, {});

			this._videoData = videoData;
			player.on('mousemove', videojs.bind(this, this.handleMouseMove)); //throttle(videojs.bind(this, this.handleMouseMove), 25));
		}

		public createEl(tagName: string, properties?: any, attributes?: any) {
			return $(TemplateUtils.renderSynch('Components/MouseTimeDisplay', {
			}))[0];
		}

		handleMouseMove(event: MouseEvent) {
	    var duration = this.player_.duration();
	    var newTime = this.calculateDistance(event) * duration;
			var position = event.pageX - $(this.el().parentNode).offset().left;

			var pointElement: any = document.elementFromPoint(event.x, event.y);
	    this.update(newTime, position, pointElement);
	  }

	  update(newTime: number, position: number, pointElement: any) {
		  var tooltipString: string;
		  if (pointElement !== undefined) {
				tooltipString = pointElement.getAttribute("data-mouse-text");
			  if (tooltipString === null)
			    tooltipString = videojs.formatTime(newTime, this.player_.duration());
		  }

		  this.el().setAttribute('data-current-time', tooltipString);
	    this.el().style.left = position + 'px';
	  }

	  calculateDistance(event: MouseEvent) {
		  var element = this.el().parentNode;
	    var x = $(element).offset().left;

		  return Math.max(0, Math.min(1, (event.pageX - x) / element.offsetWidth));
	  }
	}
}

videojs.registerComponent('MouseTimeDisplayComponent', Player.MouseTimeDisplayComponent);