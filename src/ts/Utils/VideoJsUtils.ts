module Player {
	'use strict';
	export class VideoJSUtils {
		private static dummyContentElement: any = {
			appendChild: () => {}
		};

		public static appendChildrenKeepParent(component: VideoJSComponent, appendChildrenHere: () => void) {
			var originalContentEl = component.contentEl_;
			component.contentEl_ = VideoJSUtils.dummyContentElement;
			appendChildrenHere();
			component.contentEl_ = originalContentEl;
		}
	}
}