import { Vector3 } from './../../Utils/Vector3';
import { IValidatable } from './../../Utils/IValidatable';
import { Validate } from './../../Utils/Validate';

export enum OverlayAction { None, GotoPos, OpenLink, ContinueOnClick }

export interface ActionParamsData extends IValidatable {}

'use strict';
export class GotoActionParamsData implements ActionParamsData {
	public gotoPos: number;

	public invalidate() {
		Validate.number(this.gotoPos, 'gotoPos', 0);
	}
}

'use strict';
export class LinkActionParamsData implements ActionParamsData {
	public href: string;
	public inNewWindow: boolean;

	public invalidate() {
		Validate.string(this.href, 'href');
		Validate.value(this.inNewWindow, 'inNewWindow');
	}
}

'use strict';
/**
 * Represents the data of an overlay of the video metadata.
 */
export class OverlayData implements IValidatable {
	/** An unique identifier. */
	public id: number;
	/** Start time in seconds (decimal). */
	public begin: number;
	/** Duration time in seconds (decimal). */
	public dur: number;
	/** End time in seconds (decimal). */
	public end: number;
	/** IETF language tag. */
	public lang: string;
	public tooltip: string;
	/** HTML formatted content text. */
	public content: string;
	/** Whether the user should be able to copy the content inside the overlay. */
	public isCopyableContent: boolean;
	public style: string;
	public position: string;
	/** The action to execute when the used interacts with the overlay. */
	public action: OverlayAction;
	public actionParams?: ActionParamsData;
	/** Whether to pause the video when the end of the overlay has been reached. */
	public pauseAtEnd: boolean;
	/** Whether to wait for the user to interact with the overlay or not. The video will remain paused until the user has interacted with it. */
	public waitForAction: boolean;
	/** Whether to close the overlay when the user has interacted with it or not. */
	public closeOnAction: boolean;
	/** Whether the overlay offers an additional method to the user to be closed. */
	public closeButton: boolean;
	/** Whether to display the overlay even if the user has disabled overlays in general. */
	public forceVisibility: boolean;
	/** The width of the overlay in percentage, relative to the video size. */
	public w: number;
	/** The height of the overlay in percentage, relative to the video size. */
	public h: number;
	/** Opacity from 0 to 1. */
	public opacity: number;
	/** The duration of a linear fade in animation in seconds. */
	public fadeInDuration: number;
	/** The duration of a linear fade in animation in seconds. */
	public fadeOutDuration: number;
	public translateTransform: Vector3;
	public rotateTransform: Vector3;
	public shearTransform: Vector3;

	/** @inheritdoc */
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
		if (this.actionParams !== null && this.actionParams !== undefined)
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
