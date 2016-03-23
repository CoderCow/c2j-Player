module Player {
	'use strict';
	/** Supports validation of the state of an instance. */
	export interface IValidatable {
		/**
		 * Validates the values of all properties of the type and throws an exception if a value is invalid.
		 */
		invalidate(): void;
	}
}