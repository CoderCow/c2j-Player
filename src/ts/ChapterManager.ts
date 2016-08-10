module Player {
	'use strict';
	/**
	 * Maintains multilingual chapters and their markers on the timeline.
	 */
	export class ChapterManager {
		private _player: VideoJSPlayer;
		private _videoData: VideoData;
		private _markers: ChapterMarkerComponent[];

		/** Initializes a new instance of this class. */
		public constructor(player: VideoJSPlayer, videoData: VideoData, initialLanguage: string) {
			this._player = player;
			this._videoData = videoData;
			this._markers = null;

			this.setLanguage(initialLanguage);
		}

		/** Removes all current chapters and applies those of the given language. */
		public setLanguage(languageCode: string) {
			var chapters = this._videoData.chaptersByLanguage(languageCode);

			// Sort chapters by their beginning time.
			chapters.sort((a: ChapterData, b: ChapterData) => a.begin - b.begin);

			if (this._markers !== null)
				this.removeAllMarkers();

			// note: excluding the first chapter
			this._markers = [];
			this._markers.length = chapters.length - 1;
			for (var i = 1; i < chapters.length; i++) {
				var marker = new ChapterMarkerComponent(this._player, <IChapterMarkerComponentOptions>{
					videoData: this._videoData,
					chapterData: chapters[i]
				});

				this._markers.push(marker);
				this._player.controlBar.progressControl.seekBar.addChild(marker);
			}
		}

		/** Removes all chapter markers from the player's timeline. */
		public removeAllMarkers() {
			this._markers.forEach((marker: ChapterMarkerComponent) => marker.dispose());
			this._markers = [];
		}
	}
}

// to enable the video.js chapter menu (which seems buggy atm)
//var textTrack = <VideoJSTextTrack>this.player.addTextTrack('chapters', 'chapters: ' + languageCode, languageCode);

/*chapterData.forEach((chapter: ChapterData) => {
	var cue = new VTTCue(chapter.begin, chapter.end, chapter.title);
	textTrack.addCue(cue);
});*/