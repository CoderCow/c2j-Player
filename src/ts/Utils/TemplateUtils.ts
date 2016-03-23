module Player {
	'use strict';
	/** Provides utility methods for Dust template management. */
	export class TemplateUtils {
		/** Asynchronously renders the dust template with the given name and contextData. */
		public static render(templateName: string, contextData: any, callback: (out: string) => void): void {
			dust.render(templateName, contextData, (err: any, out: string) => {
				if (err)
					alert(`Error on rendering template "${templateName}".\n${err.toString()}`);

				callback(out);
			});
		}

		/** Synchronously renders the dust template with the given name and contextData. */
		public static renderSynch(templateName: string, contextData: any): string {
			var _out: string;
			dust.render(templateName, contextData, (err: any, out: string) => {
				if (err)
					alert(`Error on rendering template "${templateName}".\n${err.toString()}`);

				_out = out;
			});

			return _out;
		}
	}
}