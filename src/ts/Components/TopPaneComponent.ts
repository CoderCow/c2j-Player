module Player {
	'use strict';
	export class TopPaneComponent extends VideoJSComponent {
		public constructor(player: VideoJSPlayer, initialTitle: string) {
			super(player, {
				el: $(TemplateUtils.renderSynch('Components/TopPane', {
					title: initialTitle,
				}))[0]
			});
		}

		public setTitle(newTitle: string) {
			$(this.el()).find('.title').text(newTitle);
		}
	}
}

videojs.registerComponent('TopPaneComponent', Player.TopPaneComponent);