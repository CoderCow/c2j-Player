import { Validate } from './../../Utils/Validate';
import { MediumData } from './MediumData';
import { Vector3 } from './../../Utils/Vector3';

export class AuthCamData {
	public begin: number;
	public dur: number;
	public end: number;
	public isMoveable: boolean;
	public isResizable: boolean;
	public isSwitchable: boolean;
	public position: string;
	public w: number;
	public h: number;
	public opacity: number;
	public fadeInDuration: number;
	public fadeOutDuration: number;
	public translateTransform: Vector3;
	public rotateTransform: Vector3;
	public shearTransform: Vector3;
	public media: LanguageDictionary<MediumData[]>;

	public invalidate() {
		Validate.number(this.begin, 'begin');
		Validate.number(this.dur, 'dur');
		Validate.number(this.end, 'end');
		Validate.value(this.isMoveable, 'isMoveable');
		Validate.value(this.isResizable, 'isResizable');
		Validate.value(this.isSwitchable, 'isSwitchable');
		Validate.string(this.position, 'position');
		Validate.number(this.w, 'w', 0);
		Validate.number(this.h, 'h', 0);
		Validate.number(this.opacity, 'opacity', 0);
		Validate.number(this.fadeInDuration, 'fadeInDuration', 0);
		Validate.number(this.fadeOutDuration, 'fadeOutDuration', 0);
		Validate.value(this.translateTransform, 'translateTransform');
		Validate.value(this.rotateTransform, 'translateTransform');
		Validate.value(this.shearTransform, 'translateTransform');
		Validate.value(this.media, 'media');
		Validate.languageIndexedValidatables(this.media, 'media');
	}
}
