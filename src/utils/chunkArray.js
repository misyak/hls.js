import { slice } from '../polyfills/uint8-slice';

export function chunkArray (myArray, chunkSize) {
  let index = 0;
  let arrayLength = myArray.length;
  let tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
    let myChunk = slice(myArray, index, index + chunkSize);
    if (myChunk.length === chunkSize) {
      tempArray.push(myChunk);
    }
  }
  return tempArray;
}
