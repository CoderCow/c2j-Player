if (typeof String.prototype.format !== 'function') {
	String.prototype.format = function(this: string, ...args: any[]): string {
		if (args === undefined)
			return this;
		if (args.length === 1 && Array.isArray(args[0]))
			args = args[0];

    return this.replace(/{(\d+)}/g, (match: string, number: number): any => {
	    let isArgInArray = typeof(args[number] != 'undefined');

	    if (isArgInArray)
		    return args[number];
	    else
		    console.error("String.format error: argument {0} was not found in array.".format(match));
	  });
  };
}

if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function(this: string, value: string): boolean {
    return (this.indexOf(value) == 0);
  };
}

if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function (this: string, value: string): boolean {
    return (this.indexOf(value) == this.length - value.length);
  };
}