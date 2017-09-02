/**
 * A component to replace existing video.js components with.
 * Use if they are required by the component model of videojs, but are not required for this player.
 */
export class DummyComponent extends VideoJSComponent {
	/** Initializes a new instance of this class. */
	public constructor(player: VideoJSPlayer) {
		super(player, {
			createEl: false,
			reportTouchActivity: false
		});
	}
}
