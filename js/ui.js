
let $save, $loading;

$(document).ready(() => {

  $save = $('#save-container');
  $loading = $('#loading');

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
  });

  function updateBlur() {
    let b = $('#blur-slider').slider('option', 'value');
    $('#blur-factor').text(`${b}x${b}`);
  }

  $('#blur-slider').slider({
      value: 11,
      min: 1,
      max: 31,
      step: 2,
      change: () => {
        updateBlur();
      },
      slide: () => {
        updateBlur();
      }
  });

  $('#toggle').click(() => {
    $('#paramContainer').slideToggle();
  });

  // configure initial state
  updateSlider();
  updateBlur();
  $('#loading').hide();
  $('#save-container').hide();
  hideGenerate();
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

function showGenerate(cb) {
  $('#generate-container').show(cb);
}

function hideGenerate(cb) {
  $('#generate-container').hide(cb);
}

function showSave(cb) {
  $save.show(cb);
}

function hideSave(cb) {
  $save.hide(50, cb);
}

function startLoad(cb) {
  $loading.slideDown(200, cb);
}

function stopLoad(cb) {
  $loading.hide(cb);
}

// hide save button and start loading
function beginGenerating(cb) {
  hideSave(() => {
    startLoad(cb);
  });
}

// stop loading and show the save button
function endGenerating(cb) {
  stopLoad(() => {
    showSave(cb);
  });
}