module Player {
	'use strict';
	export class ArrayUtils {

	}
}

interface Array<T> {
	firstOrUndefined(predicate: (item: T) => boolean): T;
	any(predicate: (item: T) => boolean): boolean;
	all(predicate: (item: T) => boolean): boolean;
}

if (typeof Array.prototype.firstOrUndefined !== 'function') {
	Array.prototype.firstOrUndefined = function (predicate: (item: any) => boolean): any {
    for (var i = 0; i < this.length; i++)
      if (this[i] !== undefined && predicate(this[i]))
        return this[i];

		return undefined;
  };
}

if (typeof Array.prototype.any !== 'function') {
	Array.prototype.any = function (predicate: (item: any) => boolean): boolean {
    return (this.firstOrUndefined(predicate) !== undefined);
  };
}

if (typeof Array.prototype.all !== 'function') {
	Array.prototype.all = function (predicate: (item: any) => boolean): boolean {
    for (var i = 0; i < this.length; i++)
      if (this[i] !== undefined && !predicate(this[i]))
        return false;

		return true;
  };
}