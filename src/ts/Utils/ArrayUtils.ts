/** Extension declarations to the JavaScript array type. */
interface Array<T> {
	/**
	 * Find the first element in this array statisfying the given condition.
	 * If no element is found, undefined is returned.
	 */
	firstOrUndefined(predicate: (item: T) => boolean): T;
	/**
	 * Checks whether any element in the array statisfies the given condition or not.
	 */
	any(predicate: (item: T) => boolean): boolean;
	/**
	 * Checks whether all elements in the array statisfy the given condition or not.
	 */
	all(predicate: (item: T) => boolean): boolean;
}

if (typeof Array.prototype.firstOrUndefined !== 'function') {
	/**
	 * Find the first element in this array statisfying the given condition.
	 * If no element is found, undefined is returned.
	 */
	Array.prototype.firstOrUndefined = function (predicate: (item: any) => boolean): any {
    for (var i = 0; i < this.length; i++)
      if (this[i] !== undefined && predicate(this[i]))
        return this[i];

		return undefined;
  };
}

if (typeof Array.prototype.any !== 'function') {
	/**
	 * Checks whether any element in the array statisfies the given condition or not.
	 */
	Array.prototype.any = function (predicate: (item: any) => boolean): boolean {
    return (this.firstOrUndefined(predicate) !== undefined);
  };
}

if (typeof Array.prototype.all !== 'function') {
	/**
	 * Checks whether all elements in the array statisfy the given condition or not.
	 */
	Array.prototype.all = function (predicate: (item: any) => boolean): boolean {
    for (var i = 0; i < this.length; i++)
      if (this[i] !== undefined && !predicate(this[i]))
        return false;

		return true;
  };
}