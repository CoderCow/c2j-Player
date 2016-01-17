module Player {
	'use strict';
	export class Validate {
		private static langCodeValidator = /^\w{2}(\-\w{2})?$/;

		public static number(input: number, inputName: string, min: number = null, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (typeof input !== 'undefined' && input !== null) {
				if (min !== null && input < min)
					throw new ValidationException(inputName, `The number "${inputName}" has to be equal or greater to ${min}, but it is ${input}.`);
			}

			Validate.value(input, inputName, mayBeUndefined, mayBeNull);
		}

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

		public static languageCode(input: string, inputName: string, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (typeof input !== 'undefined' && input !== null && !Validate.langCodeValidator.test(input))
				throw new ValidationException(inputName, `The input value "${inputName}" is no valid language code. The given value was "${input}". A valid language code would be "en-US".`);

			Validate.value(input, inputName, mayBeUndefined, mayBeNull);
		}

		public static value(input: any, inputName: string, mayBeUndefined: boolean = false, mayBeNull: boolean = mayBeUndefined): void {
			if (!mayBeUndefined && typeof input === 'undefined')
				throw new ValidationException(inputName, `The input value "${inputName}" was undefined.`);
			if (!mayBeNull && input === null)
				throw new ValidationException(inputName, `The input value "${inputName}" was null.`);
		}

		public static languageIndexedItems<T>(indexedItems: LanguageIndexed<T>, indexedPropertyName: string, checkFunc: (language: string, item: T) => void) {
			$.each(indexedItems, (language: string, item: T) => {
				try {
					Validate.languageCode(language, 'language');
					checkFunc(language, item);
				} catch (e) {
					throw new ValidationException(indexedPropertyName, `In "${indexedPropertyName}" the item with language code "${language}" is invalid. See inner exception for details.`, e);
				}
			});
		}

		public static languageIndexedValidatable(indexedItems: LanguageIndexed<Validatable>, indexedPropertyName: string) {
			$.each(indexedItems, (language: string, item: Validatable) => {
				try {
					Validate.languageCode(language, 'language');
					item.invalidate();
				} catch (e) {
					throw new ValidationException(indexedPropertyName, `In "${indexedPropertyName}" the item with language code "${language}" is invalid. See inner exception for details.`, e);
				}
			});
		}

		public static languageIndexedValidatables(indexedItems: LanguageIndexed<Validatable[]>, indexedPropertyName: string) {
			$.each(indexedItems, (language: string, items: Validatable[]) => {
				var i = 0;
				try {
					Validate.languageCode(language, 'language');

					items.forEach((item: Validatable) => {
						item.invalidate();
						i++;
					});
				} catch (e) {
					throw new ValidationException(indexedPropertyName, `In "${indexedPropertyName}" the item ${i} with language code "${language}" is invalid. See inner exception for details.`, e);
				}
			});
		}

		public static validatable(validatable: Validatable, propertyName: string) {
			try {
				validatable.invalidate();
			} catch (e) {
				throw new ValidationException(propertyName, `The value of "${propertyName}" is invalid. See inner exception for details.`, e);
			}
		}
	}
}