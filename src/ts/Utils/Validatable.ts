module Player {
	'use strict';
	export interface Validatable {
		/**
		 * Validates the values of all properties of the type and throws an exception if a value is invalid.
		 */
		invalidate(): void;
	}
}