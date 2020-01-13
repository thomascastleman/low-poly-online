$(document).ready(() => {
  $('#detail-slider').slider({
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
      change: () => {
          $('#detail-factor').text($('#detail-slider').slider('option', 'value'));
      },
      slide: () => {
          $('#detail-factor').text($('#detail-slider').slider('option', 'value'));
      }
  })

  $('#detail-factor').text($('#detail-slider').slider('option', 'value'));

  $('#blur-slider').slider({
      value: 21,
      min: 1,
      max: 31,
      step: 2,
      change: () => {
          $('#blur-factor').text($('#blur-slider').slider('option', 'value'));
      },
      slide: () => {
          $('#blur-factor').text($('#blur-slider').slider('option', 'value'));
      }
  })

  $('#blur-factor').text($('#blur-slider').slider('option', 'value'));
});

function updateParams() {
  params.outputScale = parseFloat($('#output-scale').val());
  params.detailFactor = parseFloat($('#detail-factor').text());
  params.blurKernelSize = parseFloat($('#blur-factor').text());

  // rebuild the low poly buffer since the output scalar may have changed
  initializeLowPoly();
}

function resetOutputScale() {
    params.outputScale = 1;
    $('#output-scale').val(1)
}