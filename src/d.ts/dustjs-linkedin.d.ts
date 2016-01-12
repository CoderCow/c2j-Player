// Type definitions for linkedin dustjs 1.2.1
// Project: https://github.com/linkedin/dustjs
// Definitions by: Marcelo Dezem <http://github.com/mdezem>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
//
// Edited by: David-Kay Posmyk
// Changes:
//   * Removed module definition and added static 'dust' declaration.
//   * Fixed some missing / wrong return types.

//
// Due to a lack of documentation it's not possible
// to know which methods are intended to be public and which
// are intended to be used internally by the framework.
// All the interfaces definitions here exposes only the methods
// that are documented in some way (tutorials, guides, references, etc.).
//
// Fell free to include other methods. If possible let me know about.
//

/**
 * A template compiled into a js function.
 */
interface DustTemplate {
	(chk:DustChunk, ctx:DustContext): DustChunk;
}

interface DustChunk {
	/**
	 * Writes data to this chunk's buffer.
	 */
	write(data:string): DustChunk;

	/**
	 * Writes data to this chunk's buffer and marks it as flushable. This method must be called on any chunks created via chunk.map. Do not call this method on a handler's main chunk -- dust.render and dust.stream take care of this for you.
	 */
	end(data:string): DustChunk;

	/**
	 * Creates a new chunk and passes it to callback. Use map to wrap asynchronous functions and to partition the template for streaming.
	 */
	map(callback:(chunk:DustChunk) => any): DustChunk;

	/**
	 * Convenience method to apply filters to a stream.
	 */
	tap(callback:(value:any) => any): DustChunk;

	/**
	 * Removes the head tap function from the list.
	 */
	untap(): DustChunk;

	/**
	 * Renders a template block, such as a default block or an else block.
	 */
	render(body:any, context:DustContext): DustChunk;

	/**
	 * Sets an error on this chunk and immediately flushes the output.
	 */
	setError(err:any): DustChunk;
}

interface DustContext {
	/**
	 * Retrieves the value at key from the context stack.
	 */
	get (key:string): any;

	/**
	 * Pushes an arbitrary value onto the context stack and returns a new context instance. Specify index and/or length to enable enumeration helpers.
	 */
	push(head:any, idx?:number, len?:number): DustContext;

	/**
	 * Returns a new context instance consisting only of the value at head, plus any previously defined global object.
	 */
	rebase(head:any): DustContext;

	/**
	 * Returns the head of the context stack.
	 */
	current(): any;
}

interface DustStream {
	flush(): void;
	emit(evt:string, data:any): boolean;

	/*
	 * Registers an event listener. Streams accept a single listener for a given event.
	 * @param evt the event. Possible values are data, end, error (maybe more, look in the source).
	 */
	on(evt:string, callback:(data?:any) => any): DustStream;

	pipe(stream:DustStream): DustStream;
}

interface DustStatic {
	/**
	 * register a template into the cache.
	 * @param name the unique template name.
	 * @param tmpl the template function.
	 */
	register(name:string, tmpl:DustTemplate): void;

	/**
	 * compile a template body into a string of JavaScript source code
	 * @param source the template string
	 * @param name the name used to register the compiled template into the internal cache. See render().
	 * @strip strip whitespaces from the output. Defaults to false.
	 */
	compile(source:string, name:string, strip?:boolean): string;

	/**
	 * Compiles source directly into a JavaScript function that takes a context and an optional callback (see dust.renderSource). Registers the template under [name] if this argument is supplied.
	 * @param source the template string
	 * @param name the template name (optional).
	 */
	compileFn(source:string, name?:string): DustTemplate;

	/**
	 * Evaluates a compiled source string.
	 */
	loadSource(compiled:string): DustTemplate;

	/**
	 * Renders the named template and calls callback on completion.context may be a plain object or an instance of dust.DustContext.
	 * @param name the template name.
	 * @param context a plain object or an instance of dust.DustContext.
	 */
	render(name:string, context:any, callback:(err:any, out:string) => any): void;
	render(name:string, context:DustContext, callback:(err:any, out:string) => any): void;

	/**
	 * Compiles and renders source, invoking callback on completion. If no callback is supplied this function returns a DustStream object. Use this function when precompilation is not required.
	 * @param source the template string.
	 * @param context a plain object or an instance of dust.DustContext.
	 * @param callback (optional). If supplied the callback will be called passing the result string. If omitted, renderSource() will return a dust.DustStream object.
	 */
	renderSource(source:string, context:any): DustStream;
	renderSource(source:string, context:DustContext): DustStream;
	renderSource(source:string, context:any, callback:(err:any, out:string) => any): void;
	renderSource(source:string, context:DustContext, callback:(err:any, out:string) => any): void;

	/**
	 * Streams the named template. context may be a plain object or an instance of dust.DustContext. Returns an instance of dust.DustStream.
	 * @param name the template name.
	 * @param context a plain object or an instance of dust.DustContext.
	 */
	stream(name:string, context:any): DustStream;
	stream(name:string, context:DustContext): DustStream;

	/**
	 * Manufactures a dust.DustContext instance with its global object set to object.
	 * @param global a plain object or an instance of dust.DustContext.
	 */
	makeBase(global:any): DustContext;
	makeBase(global:DustContext): DustContext;

	escapeHtml(html:string): string;
	escapeJs(js:string): string;

	debugLevel: string;
}

declare var dust:DustStatic;