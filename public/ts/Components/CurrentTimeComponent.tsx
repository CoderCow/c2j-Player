import vtreeToDomElement = require('virtual-dom/create-element');

/** The display of the current playback time aside of the player's play button. */
export class CurrentTimeComponent extends VideoJSComponent {
	private _currentTimeElement: JQuery;
	private _durationTimeElement: JQuery;

	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer) {
		super(player, {});

		player.on('timeupdate', this.updateContent.bind(this));
	}

	/** @inheritdoc */
	public createEl(tagName: string, properties?: any, attributes?: any) {
		var el = vtreeToDomElement(<div className="vjs-current-time vjs-time-control vjs-control" aria-live="off">
			<span className="vjs-control-text">{this.localize('Time')}</span>
			<span className="video-current-time"></span>
			&nbsp;/&nbsp;
			<span className="video-duration-time"></span>
		</div>);

		var $el = $(el);
		this._currentTimeElement = $el.find('.video-current-time');
		this._durationTimeElement = $el.find('.video-duration-time');

		return el;
	}

	/** Updates the current playback time. */
	public updateContent() {
		var time = (this.player_.scrubbing()) ? this.player_.getCache().currentTime : this.player_.currentTime();
		this._currentTimeElement.text(videojs.formatTime(time, this.player_.duration()));
		this._durationTimeElement.text(videojs.formatTime(this.player_.duration()));
	}
}

videojs.registerComponent('CurrentTimeComponent', CurrentTimeComponent);
