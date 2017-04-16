import { VideoData } from './../../../Data/VideoData/VideoData';

export interface ILanguageMenuOptions {
	videoData: VideoData;
	isSimpleMenuMode: boolean;
	initialMediaLanguage: string;
	initialAdditionalsLanguage: string;
	initialSubtitleLanguage: string;
}
