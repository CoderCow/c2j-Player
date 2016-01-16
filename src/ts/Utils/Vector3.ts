module Player {
	'use strict';
	export class Vector3 extends Vector2 {
		public constructor(x: number, y: number, public z: number) {
			super(x, y);
		}
	}
}