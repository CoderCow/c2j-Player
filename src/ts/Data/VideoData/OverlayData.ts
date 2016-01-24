module Player {
	export enum OverlayAction { None, GotoPos, OpenLink, ContinueOnClick }

	export interface ActionParamsData extends Validatable {}

	export class GotoActionParamsData implements ActionParamsData {
		public gotoPos: number;

		public invalidate() {
			Validate.number(this.gotoPos, 'gotoPos', 0);
		}
	}

	export class LinkActionParamsData implements ActionParamsData {
		public href: string;
		public inNewWindow: boolean;

		public invalidate() {
			Validate.string(this.href, 'href');
			Validate.value(this.inNewWindow, 'inNewWindow');
		}
	}

	'use strict';
	export class OverlayData implements Validatable {
		public id: number;
		public begin: number;
		public dur: number;
		public end: number;
		public lang: string;
		public tooltip: string;
		public content: string;
		public isCopyableContent: boolean;
		public style: string;
		public position: string;
		public action: OverlayAction;
		public actionParams: ActionParamsData;
		public pauseAtEnd: boolean;
		public waitForAction: boolean;
		public closeOnAction: boolean;
		public closeButton: boolean;
		public forceVisibility: boolean;
		public w: number;
		public h: number;
		public opacity: number;
		public fadeInDuration: number;
		public fadeOutDuration: number;
		public translateTransform: Vector3;
		public rotateTransform: Vector3;
		public shearTransform: Vector3;

		public invalidate() {
			Validate.number(this.id, 'id', 0);
			Validate.number(this.begin, 'begin');
			Validate.number(this.dur, 'dur');
			Validate.number(this.end, 'end');
			Validate.languageCode(this.lang, 'lang');
			Validate.string(this.tooltip, 'tooltip');
			Validate.string(this.content, 'content');
			Validate.value(this.isCopyableContent, 'isCopyableContent');
			Validate.string(this.style, 'style');
			Validate.string(this.position, 'position');
			Validate.value(this.action, 'action');
			Validate.value(this.actionParams, 'actionParams', false, true);
			if (this.actionParams !== null)
				Validate.validatable(this.actionParams, 'actionParams');
			Validate.value(this.pauseAtEnd, 'pauseAtEnd');
			Validate.value(this.waitForAction, 'waitForAction');
			Validate.value(this.closeOnAction, 'closeOnAction');
			Validate.value(this.closeButton, 'closeButton');
			Validate.value(this.forceVisibility, 'forceVisibility');
			Validate.value(this.forceVisibility, 'forceVisibility');
			Validate.number(this.w, 'w', 0);
			Validate.number(this.h, 'h', 0);
			Validate.number(this.opacity, 'opacity', 0);
			Validate.number(this.fadeInDuration, 'fadeInDuration', 0);
			Validate.number(this.fadeOutDuration, 'fadeOutDuration', 0);
			Validate.value(this.translateTransform, 'translateTransform');
			Validate.value(this.rotateTransform, 'translateTransform');
			Validate.value(this.shearTransform, 'translateTransform');
		}
	}
}