module Player {
	'use strict';
	export declare class Error {
		public name: string;
		public message: string;
		public stack: string;

		public constructor(message?: string);
	}

	/**
	 * A TypeScript inheritable and catchable error.
	 */
	export class Exception extends Error {
		private _inner: Exception;

		public constructor(public message: string, inner: Exception = null) {
			super(message);
			this.name = 'Exception';
			this.stack = (<any>new Error()).stack;
			this._inner = inner || null;
		}

		public get inner(): Exception {
			return this._inner;
		}

		public toString() {
			var stringValue = this.name + ': ' + this.message;
			if (typeof this.stack !== 'undefined')
				stringValue += '\nStack trace: \n' + this.stack;
			if (this._inner !== null)
				stringValue += '\n------------inner-->\n' + this._inner.toString();

			return stringValue;
		}
	}
}