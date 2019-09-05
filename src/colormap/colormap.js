'use strict';

var colorScale = require('./colorScale');
var lerp = require('lerp');

module.exports = createColormap;

function createColormap (spec) {
  /*
     * Default Options
     */
  var indicies, fromrgba, torgba,
    nsteps, cmap, colormap, format,
    nshades, colors, alpha, i;

  if (!spec) spec = {};

  nshades = (spec.nshades || 72) - 1;
  format = spec.format || 'hex';

  colormap = spec.colormap;
  if (!colormap) colormap = 'jet';

  if (typeof colormap === 'string') {
    colormap = colormap.toLowerCase();

    if (!colorScale[colormap]) {
      throw Error(colormap + ' not a supported colorscale');
    }

    cmap = colorScale[colormap];
  } else if (Array.isArray(colormap)) {
    cmap = colormap.slice();
  } else {
    throw Error('unsupported colormap option', colormap);
  }

  if (cmap.length > nshades + 1) {
    throw new Error(
      colormap + ' map requires nshades to be at least size ' + cmap.length
    );
  }

  if (!Array.isArray(spec.alpha)) {
    if (typeof spec.alpha === 'number') {
      alpha = [spec.alpha, spec.alpha];
    } else {
      alpha = [1, 1];
    }
  } else if (spec.alpha.length !== 2) {
    alpha = [1, 1];
  } else {
    alpha = spec.alpha.slice();
  }

  // map index points from 0..1 to 0..n-1
  indicies = cmap.map(function (c) {
    return Math.round(c.index * nshades);
  });

  // Add alpha channel to the map
  alpha[0] = Math.min(Math.max(alpha[0], 0), 1);
  alpha[1] = Math.min(Math.max(alpha[1], 0), 1);

  let steps = cmap.map(function (c, i) {
    let index = cmap[i].index;

    let rgba = cmap[i].rgb.slice();

    // if user supplies their own map use it
    if (rgba.length === 4 && rgba[3] >= 0 && rgba[3] <= 1) {
      return rgba;
    }
    rgba[3] = alpha[0] + (alpha[1] - alpha[0]) * index;

    return rgba;
  });

  /*
     * map increasing linear values between indicies to
     * linear steps in colorvalues
     */
  var colorsArray = [];
  for (i = 0; i < indicies.length - 1; ++i) {
    nsteps = indicies[i + 1] - indicies[i];
    fromrgba = steps[i];
    torgba = steps[i + 1];

    for (let j = 0; j < nsteps; j++) {
      let amt = j / nsteps;
      colorsArray.push([
        Math.round(lerp(fromrgba[0], torgba[0], amt)),
        Math.round(lerp(fromrgba[1], torgba[1], amt)),
        Math.round(lerp(fromrgba[2], torgba[2], amt)),
        lerp(fromrgba[3], torgba[3], amt)
      ]);
    }
  }

  // add 1 step as last value
  colorsArray.push(cmap[cmap.length - 1].rgb.concat(alpha[1]));

  if (format === 'hex') colorsArray = colorsArray.map(rgb2hex);
  else if (format === 'rgbaString') colorsArray = colorsArray.map(rgbaStr);
  else if (format === 'float') colorsArray = colorsArray.map(rgb2float);

  return colorsArray;
}

function rgb2float (rgba) {
  return [
    rgba[0] / 255,
    rgba[1] / 255,
    rgba[2] / 255,
    rgba[3]
  ];
}

function rgb2hex (rgba) {
  let dig, hex = '#';
  for (let i = 0; i < 3; ++i) {
    dig = rgba[i];
    dig = dig.toString(16);
    hex += ('00' + dig).substr(dig.length);
  }
  return hex;
}

function rgbaStr (rgba) {
  return 'rgba(' + rgba.join(',') + ')';
}
