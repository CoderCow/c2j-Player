import { IGoToPositionButtonOptions } from './IGoToPositionButtonOptions';

/** A button which changes playback position when clicked. */
export class GoToPositionButtonComponent extends VideoJSButton {
	private _goToPosition: number;

	/**
	 * Initializes a new instance of this class.
	 */
	public constructor(player: VideoJSPlayer, options: IGoToPositionButtonOptions) {
		super(player, { cjOptions: options });

		this._goToPosition = options.goToPosition;
	}

	/** @inheritdoc */
	public handleClick(event: Event) {
		this.player_.currentTime(this._goToPosition);

		super.handleClick(event);
	}

	public cjOptions(): IGoToPositionButtonOptions {
		return this.options_.cjOptions;
	}
}

videojs.registerComponent('GoToPositionButtonComponent', GoToPositionButtonComponent);
