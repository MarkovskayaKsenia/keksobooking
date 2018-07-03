'use strict';

(function () {
  var yCoords = {
    MIN: 130,
    MAX: 630
  };

  var formFields = document.querySelectorAll('fieldset');
  var filterSelects = document.querySelectorAll('select');
  var disableForms = function () {
    for (var j = 0; j < formFields.length; j++) {
      formFields[j].setAttribute('disabled', 'true');
    }
    for (var k = 0; k < filterSelects.length; k++) {
      filterSelects[k].setAttribute('disabled', 'true');
    }
  };
  disableForms();
  var enableForms = function () {
    for (var j = 0; j < formFields.length; j++) {
      formFields[j].removeAttribute('disabled');
    }
    for (var k = 0; k < filterSelects.length; k++) {
      filterSelects[k].removeAttribute('disabled');
    }
  };

  // Переменные для активации карты
  var mapWindow = document.querySelector('.map');
  window.selectors.addresInput.value = window.utils.getCoordsPin(window.selectors.mainPin.offsetLeft, window.selectors.mainPin.offsetTop, window.utils.MAIN_PIN_WIDTH, window.utils.MAIN_PIN_HEIGHT / 2);

  // Функция для проверки активности карты
  var checkMapActive = function () {
    return !mapWindow.classList.contains('map--faded');
  };

  // Функция для активации карты
  var mapActivate = function () {
    enableForms();
    window.selectors.addresInput.value = window.utils.getCoordsPin(window.selectors.mainPin.offsetLeft, window.selectors.mainPin.offsetTop, window.utils.MAIN_PIN_WIDTH, window.utils.MAIN_PIN_HEIGHT + window.utils.MAIN_PIN_TALE);
    mapWindow.classList.remove('map--faded');
    window.selectors.adForm.classList.remove('ad-form--disabled');
    window.backend.load(window.onSuccess, window.utils.onError);
  };

  var limits = {
    left: 0,
    right: mapWindow.offsetWidth - window.utils.MAIN_PIN_WIDTH,
    top: yCoords.MIN - window.utils.MAIN_PIN_HEIGHT - window.utils.MAIN_PIN_TALE,
    bottom: yCoords.MAX - window.utils.MAIN_PIN_HEIGHT - window.utils.MAIN_PIN_TALE
  };
  var limitMainPinMove = function (left, top) {
    return (left < limits.left) || (left > limits.right) || (top < limits.top) || (top > limits.bottom);
  };

  window.selectors.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };


      if (limitMainPinMove(window.selectors.mainPin.offsetLeft - shift.x, window.selectors.mainPin.offsetTop - shift.y)) {
        return;
      }
      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };

      var top = window.selectors.mainPin.offsetTop - shift.y;
      var left = window.selectors.mainPin.offsetLeft - shift.x;
      window.selectors.mainPin.style.top = top + 'px';
      window.selectors.mainPin.style.left = left + 'px';

      window.selectors.addresInput.value = window.utils.getCoordsPin(window.selectors.mainPin.offsetLeft, window.selectors.mainPin.offsetTop, window.utils.MAIN_PIN_WIDTH, window.utils.MAIN_PIN_HEIGHT + window.utils.MAIN_PIN_TALE);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      if (!checkMapActive()) {
        mapActivate();
      }
      mapWindow.removeEventListener('mousemove', onMouseMove);
      mapWindow.removeEventListener('mouseup', onMouseUp);
    };

    mapWindow.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
