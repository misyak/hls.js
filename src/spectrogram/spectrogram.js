const spectrogram = require('spectrogram');
const colormap = require('colormap');

export default class Spectrogram {
  spectro;

  constructor (canvas) {
    this.drawSpectrogram = this.drawSpectrogram.bind(this);
    this.initSpectrogram = this.initSpectrogram.bind(this);

    this.initSpectrogram(canvas);
  }

  initSpectrogram (canvas) {
    const spectrogramColorMap = colormap({
      colormap: 'magma',
      nshades: 256,
      format: 'rgb',
      alpha: 1
    });

    this.spectro = spectrogram(canvas, {
      colors: spectrogramColorMap,
      audio: {
        enable: false
      }
    });

    return this.spectro;
  }

  drawSpectrogram (data) {
    this.spectro.createCanvas(data);
  }
}
