module Player {
	'use strict';
	export interface Camtasia2JsonObject {
		id: number;
		meta: {
			version: string;
			cat: number;
			generator: string;
			dur: number;
			author: string;
			date: string;
			defaultLang: string;
			contact: string;
			socialShareUrl: string;
			enableSocialShareButtons: boolean;
			tags: string;
			poster: string;
			titles: {
				lang: string;
				title: string;
			}[];
			descriptions: {
				lang: string;
				description: string;
			}[];
		};
		media: {
			digital: {
				src: string;
				type: string;
				lang: string;
			}[];
		};
		authorNotes: {
			begin: number;
			dur: number;
			title: string;
			lang: string;
			content: string;
			tooltip: string;
			chapter: number;
			displayInTimeline: boolean;
			displayInChapters: boolean;
			displayOnScreen: boolean;
		}[];
		captionSettings: {
			fontName: string;
			backgroundColor: number[];
			foregroundColor: number[];
			alignment: string;
			opacity: number;
			isBackgroundEnabled: boolean;
			isBackgroundOnlyAroundText: boolean;
		};
		captions: {
			begin: number;
			dur: number;
			lang: string;
			content: string;
		}[];
		categories: {
			id: number;
			lang: string;
			title: string;
			begin: number;
			dur: number;
			description: string;
			tooltip: string;
		}[];
		chapters: {
			id: number;
			lang: string;
			title: string;
			begin: string;
			dur: number;
			videoType: string;
			description: string;
			category: number;
			tooltip: string;
			tags: string;
			charts: {
				id: number;
				begin: number;
				dur: number;
				title: string;
				thumbnail: string;
			}[];
			additionals: {
				type: string;
				title: string;
				description: string;
				tooltip: string;
				links: {
					title: string;
					href: string;
					tooltip: string;
				}[];
			}[];
		}[];
		overlaySettings: {
			isEnabledByDefault: boolean;
			isSwitchable: boolean;
		};
		overlays: {
			id: number;
			lang: string;
			being: number;
			dur: number;
			content: string;
			isCopyableContent: boolean;
			style: string;
			position: string;
			action: string;
			actionParams: {
				gotoPos: number;
				href: string;
				inNewWindow: boolean;
			};
			waitForAction: boolean;
			closeOnAction: boolean;
			closeButton: boolean;
			forceVisibility: boolean;
			w: number;
			h: number;
			translateTransform: number[];
			rotateTransform: number[];
			shearTransform: number[];
			opacity: number;
			tooltip: string;
			fadeInDuration: number;
			fadeOutDuration: number;
		}[];
		authCam: {
			begin: number;
			dur: number;
			isMoveable: boolean;
			isResizable: boolean;
			isSwitchable: boolean;
			position: string;
			w: number;
			h: number;
			translateTransform: number[];
			rotateTransform: number[];
			shearTransform: number[];
			opacity: number;
			fadeInDuration: number;
			fadeOutDuration: number;
			media: {
				src: string;
				type: string;
				lang: string;
			}[];
		};
	}
}