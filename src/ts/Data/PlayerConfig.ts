module Player {
	'use strict';
	export class PlayerConfig implements PlayerConfigJsonObject, Validatable {
		public videoMetadataUrl: string;
		public defaultVideoMetadataUrl: string;
		public startPlaybackAt: number;
		public videoMetaBaseUrl: string;
		public videoMediaBaseUrl: string;
		public disallowFullscreen: boolean;
		public enableSubtitleByDefault: boolean;
		public disableAuthorNotes: boolean;
		public disableOverlays: boolean;
		public playerLanguage: string;

		public constructor() {
			this.videoMetadataUrl = null;
			this.defaultVideoMetadataUrl = null;
			this.startPlaybackAt = null;
			this.videoMetaBaseUrl = null;
			this.videoMediaBaseUrl = null;

			this.disallowFullscreen = true;
			this.enableSubtitleByDefault = false;
			this.disableAuthorNotes = false;
			this.disableOverlays = false;
			this.playerLanguage = null;
		}

		public invalidate(): void {
			Validate.string(this.videoMetadataUrl, 'videoMetadataUrl', 1, null, false, true);
			Validate.string(this.defaultVideoMetadataUrl, 'defaultVideoMetadataUrl', 1, null, false, true);
			Validate.number(this.startPlaybackAt, 'startPlaybackAt', 0, false, true);
			Validate.string(this.videoMetaBaseUrl, 'videoMetaBaseUrl', null, null, false, true);
			Validate.string(this.videoMediaBaseUrl, 'videoMediaBaseUrl', null, null, false, true);
			Validate.value(this.disallowFullscreen, 'disallowFullscreen');
			Validate.value(this.enableSubtitleByDefault, 'enableSubtitleByDefault');
			Validate.value(this.disableAuthorNotes, 'disableAuthorNotes');
			Validate.value(this.disableOverlays, 'disableOverlays');
			Validate.string(this.playerLanguage, 'playerLanguage', 1, null, false, true);
		}
	}
}