export function slice (array, begin, end) {
  return new Uint8Array(Array.prototype.slice.call(array, begin, end));
}
