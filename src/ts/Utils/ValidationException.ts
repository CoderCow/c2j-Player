module Player {
	'use strict';
	export class ValidationException extends Exception {
		public constructor(private _inputValueName: string, message: string, inner: Exception = null) {
			super(message, inner);
			this.name = 'ValidationException';
		}

		public get inputValueName(): string {
			return this._inputValueName;
		}
	}
}