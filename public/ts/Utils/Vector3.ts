import { Vector2 } from './Vector2';

/** Represents a geometrical vector with three components: x, y and z. */
export class Vector3 extends Vector2 {
	/** Initializes a new instance of this class. */
	public constructor(x: number, y: number, public z: number) {
		super(x, y);
	}
}
