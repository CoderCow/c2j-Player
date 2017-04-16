import { Validate } from './../Utils/Validate';
import { IValidatable } from './../Utils/IValidatable';
import { IPlayerConfig } from './IPlayerConfig';

export class PlayerConfig implements IPlayerConfig, IValidatable {
	public videoMetadataUrl?: string;
	public defaultVideoMetadataUrl?: string;
	public startPlaybackAt?: number;
	public videoMetaBaseUrl?: string;
	public videoMediaBaseUrl?: string;
	public disallowFullscreen: boolean;
	public enableSubtitlesByDefault: boolean;
	public disableAuthorNotes: boolean;
	public disableOverlays: boolean;
	public playerLanguage?: string;
	public mediaLanguage?: string;
	public additionalsLanguage?: string;
	public subtitlesLanguage?: string;
	public autoplay: boolean;
	public simpleLanguageSelection: boolean;

	public constructor() {
		this.disallowFullscreen = false;
		this.enableSubtitlesByDefault = false;
		this.disableAuthorNotes = false;
		this.disableOverlays = false;
		this.autoplay = false;
		this.simpleLanguageSelection = false;
	}

	public invalidate(): void {
		Validate.string(this.defaultVideoMetadataUrl, 'defaultVideoMetadataUrl', 1, undefined, true, true);
		Validate.number(this.startPlaybackAt, 'startPlaybackAt', 0, true, false);
		Validate.string(this.videoMetaBaseUrl, 'videoMetaBaseUrl', undefined, undefined, true, true);
		Validate.string(this.videoMediaBaseUrl, 'videoMediaBaseUrl', undefined, undefined, true, true);
		Validate.value(this.disallowFullscreen, 'disallowFullscreen');
		Validate.value(this.enableSubtitlesByDefault, 'enableSubtitlesByDefault');
		Validate.value(this.disableAuthorNotes, 'disableAuthorNotes');
		Validate.value(this.disableOverlays, 'disableOverlays');
		Validate.string(this.playerLanguage, 'playerLanguage', 1, undefined, true, true);
	}
}
