import vtreeToDomElement = require('virtual-dom/create-element');

/** The top pane of the player window, meant to contain the video title and some extra buttons. */
export class TopPaneComponent extends VideoJSComponent {
	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer, initialTitle: string) {
		super(player, {
			el: vtreeToDomElement(<div className="top-pane">
				<span className="title">{initialTitle}</span>
			</div>)
		});
	}

	/** Sets the displayed title text. */
	public setTitle(newTitle: string) {
		$(this.el()).find('.title').text(newTitle);
	}
}

videojs.registerComponent('TopPaneComponent', TopPaneComponent);
