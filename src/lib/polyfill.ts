declare global {
  interface Array<T> {
    /**
     * Drops array elements while specified condition is met.
     * @param predicate A function that accepts up to three arguments. The dropWhile method calls the predicate function one time for each element in the array.
     */
    dropWhile(predicate: (value: T, index: number, array: T[]) => boolean): T[];
  }
}

const dropWhile = function <T>(this: T[], predicate: (value: T, index: number, array: T[]) => boolean): T[] {
  const n = this.length;
  let i = 0;

  for (; i < n; i++) {
    if (!predicate(this[i], i, this)) {
      break;
    }
  }

  return this.slice(i);
};

Array.prototype.dropWhile = dropWhile;
