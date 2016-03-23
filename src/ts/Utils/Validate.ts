module Player {
	'use strict';
	/** Provides utility methods for validating values. */
	export class Validate {
		private static langCodeValidator = /^\w{2}(\-\w{2})?$/;

		/**
		 * Validates a numeric value against the parameters specified.
		 * @param input The value to validate.
		 * @param inputName The name of the variable the input value is represented by.
		 *
		 * @throws {ValidationException} if the number is invalid.
		 */
		public static number(input: number, inputName: string, min: number = null, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (typeof input !== 'undefined' && input !== null) {
				if (min !== null && input < min)
					throw new ValidationException(inputName, `The number "${inputName}" has to be equal or greater to ${min}, but it is ${input}.`);
			}

			Validate.value(input, inputName, mayBeUndefined, mayBeNull);
		}

		/**
		 * Validates a string value against the parameters specified.
		 * @param input The value to validate.
		 * @param inputName The name of the variable the input value is represented by.
		 *
		 * @throws {ValidationException} if the string is invalid.
		 */
		public static string(input: string, inputName: string, minLength: number = null, maxLength: number = null, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (typeof input !== 'undefined' && input !== null) {
				var length = input.length;
				if (minLength !== null && length < minLength)
					throw new ValidationException(inputName, `The string "${inputName}" has to be at least ${minLength} characters long, but it has a length of ${input}.`);
				if (maxLength !== null && length > maxLength)
					throw new ValidationException(inputName, `The number "${inputName}" can not be longer than ${maxLength} characters, but it has a length of ${input}.`);
			}

			Validate.value(input, inputName, mayBeUndefined, mayBeNull);
		}

		/**
		 * Validates a date string against the parameters specified.
		 * @param input The value to validate.
		 * @param inputName The name of the variable the input value is represented by.
		 *
		 * @throws {ValidationException} if the date string is invalid.
		 */
		public static date(input: string, inputName: string, minLength: number = null, maxLength: number = null, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (typeof input !== 'undefined' && input !== null) {
				var length = input.length;
				if (minLength !== null && length < minLength)
					throw new ValidationException(inputName, `The string "${inputName}" has to be at least ${minLength} characters long, but it has a length of ${input}.`);
				if (maxLength !== null && length > maxLength)
					throw new ValidationException(inputName, `The number "${inputName}" can not be longer than ${maxLength} characters, but it has a length of ${input}.`);
			}

			Validate.value(input, inputName, mayBeUndefined, mayBeNull);
		}

		/**
		 * Validates a language code string against the parameters specified.
		 * @param input The value to validate.
		 * @param inputName The name of the variable the input value is represented by.
		 *
		 * @throws {ValidationException} if the language code is invalid.
		 */
		public static languageCode(input: string, inputName: string, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (typeof input !== 'undefined' && input !== null && !Validate.langCodeValidator.test(input))
				throw new ValidationException(inputName, `The input value "${inputName}" is no valid language code. The given value was "${input}". A valid language code would be "en-US".`);

			Validate.value(input, inputName, mayBeUndefined, mayBeNull);
		}

		/**
		 * Validates a value against the parameters specified.
		 * @param input The value to validate.
		 * @param inputName The name of the variable the input value is represented by.
		 *
		 * @throws {ValidationException} if the value is invalid.
		 */
		public static value(input: any, inputName: string, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (!mayBeUndefined && typeof input === 'undefined')
				throw new ValidationException(inputName, `The input value "${inputName}" was undefined.`);
			if (!mayBeNull && input === null)
				throw new ValidationException(inputName, `The input value "${inputName}" was null.`);
		}

		/**
		 * Validates all language codes in a LanguageDictionary aswell as the values using the given check function.
		 * The LanguageDictionary is expected to be a property of another object.
		 * @param indexedPropertyName The name of the property representing the LanguageDictionary to validate.
		 *
		 * @throws {ValidationException} if at least one of the items is invalid.
		 */
		public static languageIndexedItems<T>(indexedItems: LanguageDictionary<T>, indexedPropertyName: string, checkFunc: (language: string, item: T) => void) {
			$.each(indexedItems, (language: string, item: T) => {
				try {
					Validate.languageCode(language, 'language');
					checkFunc(language, item);
				} catch (e) {
					throw new ValidationException(indexedPropertyName, `In "${indexedPropertyName}" the item with language code "${language}" is invalid. See inner exception for details.`, e);
				}
			});
		}

		/**
		 * Validates all language codes in a LanguageDictionary of validatables aswell as the validatables themselfes.
		 * The LanguageDictionary is expected to be a property of another object.
		 * @param indexedPropertyName The name of the property representing the LanguageDictionary to validate.
		 *
		 * @throws {ValidationException} if at least one of the items is invalid.
		 */
		public static languageIndexedValidatable(indexedItems: LanguageDictionary<IValidatable>, indexedPropertyName: string) {
			$.each(indexedItems, (language: string, item: IValidatable) => {
				try {
					Validate.languageCode(language, 'language');
					item.invalidate();
				} catch (e) {
					throw new ValidationException(indexedPropertyName, `In "${indexedPropertyName}" the item with language code "${language}" is invalid. See inner exception for details.`, e);
				}
			});
		}

		/**
		 * Validates all language codes in a LanguageDictionary of validatable arrays aswell as all the validatables
		 * in the arrays. The LanguageDictionary is expected to be a property of another object.
		 * @param indexedPropertyName The name of the property representing the LanguageDictionary to validate.
		 *
		 * @throws {ValidationException} if at least one of the items is invalid.
		 */
		public static languageIndexedValidatables(indexedItems: LanguageDictionary<IValidatable[]>, indexedPropertyName: string) {
			$.each(indexedItems, (language: string, items: IValidatable[]) => {
				var i = 0;
				try {
					Validate.languageCode(language, 'language');

					items.forEach((item: IValidatable) => {
						item.invalidate();
						i++;
					});
				} catch (e) {
					throw new ValidationException(indexedPropertyName, `In "${indexedPropertyName}" the item with language code "${language}" contains an item ${i} which is invalid. See inner exception for details.`, e);
				}
			});
		}

		/**
		 * Validates a validatable which is expected to be a property of another object.
		 * @param propertyName The name of the property representing the validatable to validate.
		 *
		 * @throws {ValidationException} if the validatable is invalid.
		 */
		public static validatable(validatable: IValidatable, propertyName: string) {
			try {
				validatable.invalidate();
			} catch (e) {
				throw new ValidationException(propertyName, `The value of "${propertyName}" is invalid. See inner exception for details.`, e);
			}
		}
	}
}