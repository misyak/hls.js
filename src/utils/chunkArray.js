import { slice } from '../polyfills/uint8-slice';

export function chunkArray (myArray, chunkSize) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunkSize) {
    let myChunk = slice(myArray, index, index + chunkSize);
    if (myChunk.length === chunkSize) {
      tempArray.push(myChunk);
    }
  }
  return tempArray;
}
