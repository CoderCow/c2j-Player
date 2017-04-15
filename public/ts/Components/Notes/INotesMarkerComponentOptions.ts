import { INoteData } from './../../Data/VideoData/INoteData';
import { IMenuMarkerComponentOptions } from './../Buttons/IMenuMarkerComponentOptions';

export interface INotesMarkerComponentOptions extends IMenuMarkerComponentOptions {
	notes: INoteData[];
}
