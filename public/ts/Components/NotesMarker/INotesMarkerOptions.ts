import { INoteData } from './../../Data/VideoData/INoteData';
import { IMenuMarkerOptions } from './../MenuMarker';

export interface INotesMarkerOptions extends IMenuMarkerOptions {
	notes: INoteData[];
}
