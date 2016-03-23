/// <reference path="Validate.ts" />

module Player {
	'use strict';
	/** Represents a value which is lazy loaded when its first accessed. */
	export class Lazy<T> {
		/** The cached value, as provided by the factory. */
		private _value: T;
		/** The factory to create the value. */
		private _valueFactory: () => T;

		/** Initializes a new instance of this class. */
		public constructor(valueFactory: () => T) {
			Validate.value(valueFactory, 'valueFactory');

			this._valueFactory = valueFactory;
		}

		/** Gets the value. Calls the factory first if no cached value is present. */
		public get value(): T {
			if (!this.hasLoaded) {
				this._value = this._valueFactory();
				this._valueFactory = undefined;
			}

			return this._value;
		}

		/** Gets a value indicating whether a value is currently cached or not. */
		public get hasLoaded() {
			return (this._valueFactory === undefined);
		}
	}
}