'use strict';

(function () {
  var typeSelect = window.selectors.adForm.querySelector('#type');
  var priceInput = window.selectors.adForm.querySelector('#price');
  var timeInSelect = window.selectors.adForm.querySelector('#timein');
  var timeOutSelect = window.selectors.adForm.querySelector('#timeout');
  var roomsSelect = window.selectors.adForm.querySelector('#room_number');
  var capacitySelect = window.selectors.adForm.querySelector('#capacity');

  // Функция выбора ценового диапазона
  var choosePrice = function (val) {
    switch (val) {
      case 'flat':
        priceInput.min = '1000';
        priceInput.placeholder = '1000';
        break;
      case 'house':
        priceInput.min = '5000';
        priceInput.placeholder = '5000';
        break;
      case 'palace':
        priceInput.min = '10000';
        priceInput.placeholder = '10000';
        break;
      default:
        priceInput.min = '0';
        priceInput.placeholder = '0';
    }
  };
  // Функции для синхронизации времени заезда и выезда
  var timeInSync = function (val) {
    timeOutSelect.value = val;
  };
  var timeOutSync = function (val) {
    timeInSelect.value = val;
  };

  // Функции для синхронизации количества гостей
  var roomsMatch = function (val) {
    var options = capacitySelect.querySelectorAll('option');

    for (var j = 0; j < options.length; j++) {
      options[j].setAttribute('disabled', 'true');
      options[j].removeAttribute('selected');
    }
    switch (val) {
      case '1' :
        options[2].removeAttribute('disabled');
        capacitySelect.value = val;
        break;
      case '2' :
        options[2].removeAttribute('disabled');
        options[1].removeAttribute('disabled');
        capacitySelect.value = val;
        break;
      case '3' :
        options[2].removeAttribute('disabled');
        options[1].removeAttribute('disabled');
        options[0].removeAttribute('disabled');
        capacitySelect.value = val;
        break;
      default:
        options[3].removeAttribute('disabled');
        capacitySelect.value = '0';
        break;
    }
  };
  var setMainPinDefault = function () {
    window.selectors.mainPin.style.left = window.utils.MAIN_PIN_DEFAULT_LEFT + 'px';
    window.selectors.mainPin.style.top = window.utils.MAIN_PIN_DEFAULT_TOP + 'px';
    window.selectors.addresInput.value = window.utils.getCoordsPin(window.selectors.mainPin.offsetLeft, window.selectors.mainPin.offsetTop, window.utils.MAIN_PIN_WIDTH, window.utils.MAIN_PIN_HEIGHT + window.utils.MAIN_PIN_TALE);
  };

  typeSelect.addEventListener('change', function (evt) {
    choosePrice(evt.target.value);
  });
  timeInSelect.addEventListener('change', function (evt) {
    timeInSync(evt.target.value);
  });
  timeOutSelect.addEventListener('change', function (evt) {
    timeOutSync(evt.target.value);
  });
  roomsSelect.addEventListener('change', function (evt) {
    roomsMatch(evt.target.value);
  });
  window.selectors.adForm.addEventListener('reset', function () {
    setTimeout(setMainPinDefault, 50);
  });

  window.selectors.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.selectors.adForm), function () {
      window.selectors.adForm.reset();
    }, window.utils.onError);
  });
})();


