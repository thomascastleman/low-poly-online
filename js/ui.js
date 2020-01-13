$(document).ready(() => {

  function updateSlider() {
    $('#detail-factor').text($('#detail-slider').slider('option', 'value'));
  }

  $('#detail-slider').slider({
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
      change: () => {
          updateSlider();
      },
      slide: () => {
          updateSlider();
      }
  })

  updateSlider();

  function updateBlur() {
    let b = $('#blur-slider').slider('option', 'value');
    $('#blur-factor').text(`${b}x${b}`);
  }

  $('#blur-slider').slider({
      value: 21,
      min: 1,
      max: 31,
      step: 2,
      change: () => {
        updateBlur();
      },
      slide: () => {
        updateBlur();
      }
  })

  updateBlur();

  $('#toggle').click(() => {
    $('#paramContainer').slideToggle();
  });
});

function updateParams() {
  params.outputScale = parseFloat($('#output-scale').val());
  params.detailFactor = parseFloat($('#detail-factor').text());
  params.blurKernelSize = parseFloat($('#blur-factor').text());
  params.visualize = $('#visualize').is(":checked");
}

function resetOutputScale() {
    params.outputScale = 1;
    $('#output-scale').val(1)
}

// console.log and write to external console
function externalLog(content) {
  console.log(content);
  $('#console').append(`${content}<br>`);
}