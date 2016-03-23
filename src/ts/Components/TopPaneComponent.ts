module Player {
	'use strict';
	/** The top pane of the player window, meant to contain the video title and some extra buttons. */
	export class TopPaneComponent extends VideoJSComponent {
		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, initialTitle: string) {
			super(player, {
				el: $(TemplateUtils.renderSynch('Components/TopPane', {
					title: initialTitle,
				}))[0]
			});
		}

		/** Sets the displayed title text. */
		public setTitle(newTitle: string) {
			$(this.el()).find('.title').text(newTitle);
		}
	}
}

videojs.registerComponent('TopPaneComponent', Player.TopPaneComponent);