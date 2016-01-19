/*
Video.js Component Structure (http://docs.videojs.com/docs/guides/components.html)

Player
    PosterImage
    TextTrackDisplay
    LoadingSpinner
    BigPlayButton
    ControlBar
        PlayToggle
        FullscreenToggle
        CurrentTimeDisplay
        TimeDivider
        DurationDisplay
        RemainingTimeDisplay
        ProgressControl
            SeekBar
              LoadProgressBar
              PlayProgressBar
              SeekHandle
              MouseTimeDisplay
        VolumeControl
            VolumeBar
                VolumeLevel
                VolumeHandle
        MuteToggle
*/


module Player {
	'use strict';
	export class TestPlugin {
		public player: VideoJSPlayer;
		private testButton: TestButtonComponent;

		public constructor() {

		}

		public init(player: VideoJSPlayer) {
			this.player = player;

			this.testButton = <TestButtonComponent>this.player.controlBar.addChild('TestButtonComponent');
			// Move the button before the full screen button
			$('.vjs-fullscreen-control').before(this.testButton.el());

			this.player.on('play', () => {
				console.log('playback has started!');
			});
		}
	}
}