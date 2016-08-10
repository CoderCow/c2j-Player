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
		public constructor(message: any, inner: Exception = null) {
			if (message instanceof Error) {
				let error = <Error>message;

				super(error.message);
				this.message = error.message;
				this.name = 'Exception';
				this.stack = error.stack;
				this._inner = null;
			} else {
				super(message);
				this.message = message;
				this.name = 'Exception';
				this.stack = (<any>new Error('[' + this.name + '] ' + message + (inner ? ' See inner exception for details.' : ''))).stack;

				if (inner instanceof Exception) {
					this._inner = inner;
				} else if (inner instanceof Error) {
					this._inner = new Exception(inner);
				} else {
					this._inner = null;
				}
			}
		}

		/** The exception instances which caused this exception to be thrown.  */
		public get inner(): Exception {
			return this._inner;
		}

		/** @inheritdoc */
		public toString() {
			var stringValue = this.stack;
			if (this._inner !== null)
				stringValue += '\n------Inner Exception------\n' + this._inner.toString();

			return stringValue;
		}
	}
}