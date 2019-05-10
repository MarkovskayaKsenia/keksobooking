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
    closeCard();
    window.selectors.mainPin.style.left = mainPinDefaultX + 'px';
    window.selectors.mainPin.style.top = mainPinDefaultY + 'px';
    window.selectors.addressInput.value = getCoordsPin(mainPinDefaultX, mainPinDefaultY, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT + window.data.MAIN_PIN_TALE);
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
  });

  window.selectors.adForm.addEventListener('reset', function () {
    setTimeout(onResetButtonClick, 50);
  });
})();
