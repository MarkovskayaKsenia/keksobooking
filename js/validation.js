'use strict';

(function () {

  var typeSelect = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var timeInSelect = document.querySelector('#timein');
  var timeOutSelect = document.querySelector('#timeout');
  var roomsSelect = document.querySelector('#room_number');
  var capasitySelect = document.querySelector('#capacity');

  // Функция выбора минимальной цены за ночь
  var chooseMinPrice = function (val) {
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
        break;
    }
  };

  // Функции для синхронизации времени заезда и выезда
  var timeInSync = function (val) {
    timeOutSelect.value = val;
  };

  var timeOutSync = function (val) {
    timeInSelect.value = val;
  };

  // Функция на ограничение количества гостей
  var guestLimit = function (val) {
    var options = capasitySelect.querySelectorAll('option');

    for (var i = 0; i < options.length; i++) {
      options[i].setAttribute('disabled', 'true');
      options[i].removeAttribute('selected');
    }

    switch (val) {
      case '1':
        options[2].removeAttribute('disabled');
        capasitySelect.value = val;
        break;
      case '2':
        options[2].removeAttribute('disabled');
        options[1].removeAttribute('disabled');
        capasitySelect.value = val;
        break;
      case '3':
        options[2].removeAttribute('disabled');
        options[1].removeAttribute('disabled');
        options[0].removeAttribute('disabled');
        capasitySelect.value = val;
        break;
      default:
        options[3].removeAttribute('disabled');
        capasitySelect.value = '0';
        break;
    }
  };

  //функция установки главного пина в исходное положение
  var onResetButtonClick = function () {
    window.map.closeCard();
    window.selectors.mainPin.style.left = window.map.mainPinDefaultX + 'px';
    window.selectors.mainPin.style.top = window.map.mainPinDefaultY + 'px';
    window.selectors.addressInput.value = window.map.getCoordsPin(window.map.mainPinDefaultX, window.map.mainPinDefaultY, window.service.MAIN_PIN_WIDTH, window.service.MAIN_PIN_HEIGHT + window.service.MAIN_PIN_TALE);
  };

  typeSelect.addEventListener('change', function (evt) {
    chooseMinPrice(evt.target.value);
  });

  roomsSelect.addEventListener('change', function (evt) {
    guestLimit(evt.target.value);
  });

  timeInSelect.addEventListener('change', function (evt) {
    timeInSync(evt.target.value);
  });

  timeOutSelect.addEventListener('change', function (evt) {
    timeOutSync(evt.target.value);
    console.log(evt.target.value);
  });

  window.selectors.adForm.addEventListener('reset', function () {
    setTimeout(onResetButtonClick, 50);
  });

  window.selectors.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.selectors.adForm), function () {
      window.selectors.adForm.reset();
    }, window.service.onError);
  });
})();
