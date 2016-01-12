// Type definitions for Video.js
// Project: https://github.com/zencoder/video-js
// Definitions by: Vincent Bortone <https://github.com/vbortone/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
//
// Edited by: David-Kay Posmyk

// The Video.js API allows you to interact with the video through Javascript, whether the browser is playing the video through HTML5 video, Flash, or any other supported playback technologies.

interface VideoJSOptions {
	techOrder?: string[]; // tech names, default: ['html5','flash']
	sourceOrder?: string[];
	html5?: Object;
	flash?: Object;
	width?: number;
	height?: number;
	aspectRatio?: string; // value should be like '16:9'
	fluid?: boolean; // true will add the 'vjs-fluid' class to the video element
	defaultVolume?: number;
	inactivityTimeout?: number; // in milliseconds
	playbackRates: number[]; // Add playback rate selection by adding rates, like: [0.5, 1, 1.5, 2]
	children?: Object;
	controls?: boolean;
	src?: any; // NOT string|string[]|Object
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	preload?: string; // 'auto', ??
	language?: string; // default is 'lang' attribute value of the document's <html> tag or the browser language as fallback.
	languages?: string[];
	poster?: string;
	plugins?: any[];
	starttime?: number; // in seconds
	notSupportedMessage: string; // message to show when no appropriate tech / source was found. videojs will try to localize this string by matching it to the language tables. default: 'No compatible source was found for this video.'
}

interface VideoJSSource {
	type: string;
	src: string;
}

interface VideoJSPlayer {
	play(): VideoJSPlayer;
	pause(): VideoJSPlayer;
	paused(): boolean;
	src(newSource: string): VideoJSPlayer;
	src(newSource: VideoJSSource): VideoJSPlayer;
	src(newSource: VideoJSSource[]): VideoJSPlayer;
	currentTime(seconds: number): VideoJSPlayer;
	currentTime(): number;
	duration(): number;
	buffered(): TimeRanges;
	bufferedPercent(): number;	
	volume(percentAsDecimal: number): TimeRanges;
	volume(): number;
	width(): number;	
	width(pixels: number): VideoJSPlayer;
	height(): number;
	height(pixels: number): VideoJSPlayer;
	size(width: number, height: number): VideoJSPlayer;
	requestFullScreen(): VideoJSPlayer;
	cancelFullScreen(): VideoJSPlayer;
	ready(callback: () => void ): void;
	on(eventName: string, callback: () => void ): void;
	off(eventName: string, callback: () => void ): void;
	dispose(): void;
}

interface VideoJSStatic {
	(id: string|Element, options?: VideoJSOptions, ready?: () => void): VideoJSPlayer;
}

declare var videojs: VideoJSStatic;
