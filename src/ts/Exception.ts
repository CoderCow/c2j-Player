module Player {
	/** Just a TypeScript declaration of the JavaScript Error class (to inherit from it). */
	'use strict';
	export declare class Error {
		public name: string;
		public message: string;
		public stack: string;

		public constructor(message?: string);
	}

	/**
	 * A TypeScript inheritable and catchable exception.
	 */
	export class Exception extends Error {
		/** The exception instances which caused this exception to be thrown.  */
		private _inner: Exception;

		/** Initializes a new instance of the Exception class. */
		public constructor(public message: string, inner: Exception = null) {
			super(message);
			this.name = 'Exception';
			this.stack = (<any>new Error()).stack;
			this._inner = inner || null;
		}

		/** The exception instances which caused this exception to be thrown.  */
		public get inner(): Exception {
			return this._inner;
		}

		/** @inheritdoc */
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