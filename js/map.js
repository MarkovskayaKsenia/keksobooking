'use strict';

(function () {
  var mainPinSetup = {
    HEIGHT: 65,
    WIDTH: 65,
    TALE: 21,
    DEFAULT_LEFT: 570,
    DEFAULT_TOP: 375,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var mainPin = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var addressInput = document.querySelector('#address');
  var formFields = document.querySelectorAll('fieldset');
  window.filterForm = document.querySelector('.map__filters');
  var filterSelects = window.filterForm.querySelectorAll('select');

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
  var setMainPinDefault = function () {
    mainPin.style.left = mainPinSetup.DEFAULT_LEFT + 'px';
    mainPin.style.top = mainPinSetup.DEFAULT_TOP + 'px';
    addressInput.value = window.utils.getCoordsPin(mainPin.offsetLeft, mainPin.offsetTop, mainPinSetup.WIDTH, mainPinSetup.HEIGHT + mainPinSetup.TALE);
  };

  // Переменные для активации карты
  var mapWindow = document.querySelector('.map');
  addressInput.value = window.utils.getCoordsPin(mainPin.offsetLeft, mainPin.offsetTop, mainPinSetup.WIDTH, mainPinSetup.HEIGHT / 2);

  // Функция для проверки активности карты
  var checkMapActive = function () {
    return !mapWindow.classList.contains('map--faded');
  };

  // Функция для активации карты
  var mapActivate = function () {
    addressInput.value = window.utils.getCoordsPin(mainPin.offsetLeft, mainPin.offsetTop, mainPinSetup.WIDTH, mainPinSetup.HEIGHT + mainPinSetup.TALE);
    mapWindow.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.backend.load(window.onSuccess, window.utils.onError);
    enableForms();
  };

  window.mapDeactivate = function () {
    disableForms();
    window.filterForm.reset();
    adForm.reset();
    mapWindow.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    window.utils.closeCard();
    setMainPinDefault();
    window.utils.clearPins();
  };

  var limits = {
    left: 0,
    right: mapWindow.offsetWidth - mainPinSetup.WIDTH,
    top: mainPinSetup.MIN_Y - mainPinSetup.HEIGHT - mainPinSetup.TALE,
    bottom: mainPinSetup.MAX_Y - mainPinSetup.HEIGHT - mainPinSetup.TALE
  };

  var limitMainPinMove = function (left, top) {
    return (left < limits.left) || (left > limits.right) || (top < limits.top) || (top > limits.bottom);
  };

  mainPin.addEventListener('mousedown', function (evt) {
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

      if (limitMainPinMove(mainPin.offsetLeft - shift.x, mainPin.offsetTop - shift.y)) {
        return;
      }

      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };

      var top = mainPin.offsetTop - shift.y;
      var left = mainPin.offsetLeft - shift.x;
      mainPin.style.top = top + 'px';
      mainPin.style.left = left + 'px';

      addressInput.value = window.utils.getCoordsPin(mainPin.offsetLeft, mainPin.offsetTop, mainPinSetup.WIDTH, mainPinSetup.HEIGHT + mainPinSetup.TALE);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (!checkMapActive()) {
        mapActivate();
      }
      mapWindow.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    mapWindow.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  adForm.addEventListener('reset', function () {
    window.mapDeactivate();
  });
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), function () {
      window.utils.onSubmit();
      window.mapDeactivate();
    }, window.utils.onError);
  });
})();
