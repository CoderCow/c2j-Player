/** Provides utility methods for the videojs framework. */
export default class VideoJSUtils {
	private static dummyContentElement: any = {
		appendChild: () => {}
	};

	/**
	 * Allows to append child components to a component without altering the DOM.
	 * @param component The component to append children to.
	 * @param appendChildrenHere A function which actually appends the children by using component.append().
	 */
	public static appendChildrenKeepParent(component: VideoJSComponent, appendChildrenHere: () => void) {
		var originalContentEl = component.contentEl_;
		component.contentEl_ = VideoJSUtils.dummyContentElement;
		appendChildrenHere();
		component.contentEl_ = originalContentEl;
	}
}
