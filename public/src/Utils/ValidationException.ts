import { Exception } from './../Exception';

/** A exception to be thrown when a validation of something has failed. */
export class ValidationException extends Exception {
	private _inputValueName: string;

	/**
	 * Initializes a new instance of this class.
	 * @param inputValueName The name of the variable representing the input value which is invalid.
	 */
	public constructor(inputValueName: string, message: string, inner: Exception | undefined = undefined) {
		super(message, inner);

		this.name = 'ValidationException';
		this._inputValueName = inputValueName;
	}

	/** Gets the name of the variable representing the input value which is invalid. */
	public get inputValueName(): string {
		return this._inputValueName;
	}
}
