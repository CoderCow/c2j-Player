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
	}
}

videojs.registerComponent('TopPaneComponent', Player.TopPaneComponent);