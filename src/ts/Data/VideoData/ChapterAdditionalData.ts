module Player {
	export enum AdditionalType { Link }

	'use strict';
	export class ChapterAdditionalData implements Validatable {
		public type: AdditionalType;
		public title: string;
		public description: string;
		public tooltip: string;
		public links: LinkData[];

		public invalidate(): void {
			Validate.value(this.type, 'type');
			Validate.string(this.title, 'title');
			Validate.string(this.description, 'content');
			Validate.string(this.tooltip, 'tooltip');
			Validate.value(this.links, 'links');
		}
	}
}