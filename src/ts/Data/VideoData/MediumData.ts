module Player {
	'use strict';
	export class MediumData implements Validatable, VideoJSSource {
		public src: string;
		public type: string;
		public lang: string;

		public invalidate() {
			Validate.string(this.src, 'src');
			Validate.string(this.type, 'type');
			Validate.languageCode(this.lang, 'lang');
		}
	}
}