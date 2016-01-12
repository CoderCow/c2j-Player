module Player {
	'use strict';
	export class TemplateUtils {
		public static render(templateName: string, contextData: any, callback: (out: string) => void) {
			dust.render(templateName, contextData, (err: any, out: string) => {
				if (err)
					alert('Error on rendering template "{0}".\n{1}'.format(templateName, err.toString()));

				callback(out);
			});
		}
	}
}