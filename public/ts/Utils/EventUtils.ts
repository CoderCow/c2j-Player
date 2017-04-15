/** Provides predefined event handlers. */
export class EventUtils {
	// Binding event handlers to this static handlers instead of creating a new function each time saves performance.
	public static noImmediatePropagationHandler: (event: Event) => void = (event: Event) =>
		event.stopImmediatePropagation();
	public static noImmediatePropagationAndPreventDefaultHandler: (event: Event) => void = (event: Event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
	};
}
