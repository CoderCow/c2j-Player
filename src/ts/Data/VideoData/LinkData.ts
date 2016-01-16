module Player {
	'use strict';
	export class LinkData implements Validatable {
		public title: string;
		public href: string;
		public tooltip: string;

		public invalidate(): void {
			Validate.string(this.title, 'title');
			Validate.string(this.href, 'href');
			Validate.string(this.tooltip, 'tooltip');
		}
	}
}