interface Array<T> {
  find(predicate: (value: T, index: number, array: T[]) => boolean);
}
