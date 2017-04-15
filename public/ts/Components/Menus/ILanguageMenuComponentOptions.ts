import { VideoData } from './../../Data/VideoData/VideoData';

export interface ILanguageMenuComponentOptions {
	videoData: VideoData;
	isSimpleMenuMode: boolean;
	initialMediaLanguage: string;
	initialAdditionalsLanguage: string;
	initialSubtitleLanguage: string;
}
