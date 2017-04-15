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
	public inner?: Exception | Error;

	/** Initializes a new instance of the Exception class. */
	public constructor(message: string, inner: Exception | Error | undefined = undefined) {
		super(message);
		this.message = message;
		this.name = 'Exception';

		if (inner !== undefined) {
			this.inner = inner;
			this.inner.toString = toStringFunction.bind(this.inner);
		}

		// normal instance method definitions wouldn't work in this class
		this.toString = toStringFunction.bind(this);
	}
}

var toStringFunction = function(this: Exception) {
	let stringValue = this.stack;
	if (this.inner !== undefined) {
		let innerType = 'Error';
		if (this.inner instanceof Exception)
			innerType = 'Exception';

		stringValue += `\n------Inner ${innerType}------\n${this.inner.toString()}`;
	}

	return stringValue;
}