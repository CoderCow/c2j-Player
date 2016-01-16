/// <reference path="Validate.ts" />

module Player {
	'use strict';
	export class Lazy<T> {
		private _value: T;

		public constructor(private _valueProvider: () => T) {
			Validate.value(_valueProvider, '_valueProvider');
		}

		public get value(): T {
			if (!this.hasLoaded) {
				this._value = this._valueProvider();
				this._valueProvider = undefined;
			}

			return this._value;
		}

		public get hasLoaded() {
			return (this._valueProvider === undefined);
		}
	}
}