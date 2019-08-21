const linearInterpolate = (previousValue: number, nextValue: number, atPoint: number) => {
  return previousValue + (nextValue - previousValue) * atPoint;
};

const interpolateVectors = (source: number[][], valuesRequired: number) => {
  const interpolatedVectors: number[][] = [];

  source.forEach(vector => {
    const interpolatedVector: number[] = [];
    const springFactor = (vector.length - 1) / (valuesRequired);

    interpolatedVector[0] = vector[0];
    for (let i = 1; i < valuesRequired - 1; i++) {
      const tmp = i * springFactor;
      const previousIndex = Math.floor(tmp);
      const nextIndex = Math.ceil(tmp);
      const atPoint = tmp - previousIndex;

      const newValue = linearInterpolate(vector[previousIndex], vector[nextIndex], atPoint);

      interpolatedVector[i] = newValue;
    }
    interpolatedVector[valuesRequired - 1] = vector[vector.length - 1];
    interpolatedVectors.push(interpolatedVector);
  });
  return interpolatedVectors;
};

const getMaxValue = (source: number[][]) => {
  let max = Math.max(...source[0]);
  source.forEach(vector => {
    const actualMax = Math.max(...vector);
    max = (actualMax > max) ? actualMax : max;
  });
  return max;
};

const getMinValue = (source: number[][]) => {
  let min = Math.min(...source[0]);
  source.forEach(vector => {
    const actualMin = Math.min(...vector);
    min = (actualMin < min) ? actualMin : min;
  });
  return min;
};

const normalizeValues = (source: number[][], colorsRequired: number) => {
  const normalizedValues: number[][] = [];

  const maxValue = getMaxValue(source);
  const minValue = getMinValue(source);

  const oneColorRange = (maxValue - minValue) / colorsRequired;

  const normMin = Math.floor(minValue / oneColorRange);
  const normMax = Math.floor(maxValue / oneColorRange);

  const normalizationArray: number[] = [];

  for (let i = normMin; i <= normMax; i++) {
    normalizationArray.push(i);
  }

  source.forEach(vector => {
    const normalizedArray: number[] = [];
    vector.forEach(value => {
      const normValue = Math.floor(value / oneColorRange);
      normalizedArray.push(normalizationArray.indexOf(normValue));
    });
    normalizedValues.push(normalizedArray);
  });
  return normalizedValues;
};

const extractData = (source: number[][], step: number) => {
  const extractedData: number[][] = [];
  for (let i = 0; i < source.length; i = i + step) {
    extractedData.push(source[i]);
  }
  return extractedData;
};

export {
  interpolateVectors,
  normalizeValues,
  extractData
};
