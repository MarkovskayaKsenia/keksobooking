'use strict';
(function () {
  window.map = {
    // Функция рассчета координат уже установленной метки
    getCoordsPin: function (x, y, pinWidth, pinHeight) {
      var coordsX = Math.round(x + pinWidth / 2);
      var coordsY = Math.round(y + pinHeight);
      return coordsX + ', ' + coordsY;
    },
    // Закрытие объявления
    closeCard: function () {
      var mapCard = document.querySelector('.map__card');
      if (mapCard) {
        mapCard.remove();
      }
    },

    // Координаты главного пина по умолчанию
    mainPinDefaultX: window.selectors.mainPin.offsetLeft,
    mainPinDefaultY: window.selectors.mainPin.offsetTop
  };
  var yCoords ={
    MIN_Y: 130,
    MAX_Y: 630
  };

  window.selectors.addressInput.value = window.map.getCoordsPin(window.map.mainPinDefaultX, window.map.mainPinDefaultY, window.service.MAIN_PIN_WIDTH, window.service.MAIN_PIN_HEIGHT / 2);

  // Находим место для вставки карточки и шаблон
  var map = document.querySelector('.map');


  // Ограничиваем перемещение главного Пина границами карты.
  var mapWidth = map.offsetWidth;
  var minLeftCoord = 0 - window.service.MAIN_PIN_WIDTH / 2;
  var maxLeftCoord = mapWidth - window.service.MAIN_PIN_WIDTH / 2;
  var minTopCoord = yCoords.MIN_Y - window.service.MAIN_PIN_HEIGHT - window.service.MAIN_PIN_TALE;
  var maxTopCoord = yCoords.MAX_Y - window.service.MAIN_PIN_HEIGHT - window.service.MAIN_PIN_TALE;

  var limitMainPinMove = function (newLeft, newTop) {
    if (newLeft < minLeftCoord || newLeft > maxLeftCoord || newTop < minTopCoord || newTop > maxTopCoord) {
      return true;
    }
    return false;
  };

  // Функция проверки активности карты
  var checkMapActivate = function () {
    return !map.classList.contains('map--faded');
  };

  // Активация карты
  var activateMap = function () {
    enableForm();
    map.classList.remove('map--faded');
    window.selectors.adForm.classList.remove('ad-form--disabled');

    window.backend.load(window.onSuccess, window.service.onError);
    window.selectors.addressInput.value = window.map.getCoordsPin(window.map.mainPinDefaultX, window.map.mainPinDefaultY, window.service.MAIN_PIN_WIDTH, window.service.MAIN_PIN_HEIGHT + window.service.MAIN_PIN_TALE);
  };

  window.selectors.mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    window.selectors.mainPin.style.zIndex = 20;

    var startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };

    var onMainPinMove = function (evtMove) {
      evtMove.preventDefault();
      var shift = {
        x: startCoords.x - evtMove.pageX,
        y: startCoords.y - evtMove.pageY
      };

      if (limitMainPinMove(window.selectors.mainPin.offsetLeft - shift.x, window.selectors.mainPin.offsetTop - shift.y)) {
        return;
      }

      startCoords = {
        x: evtMove.pageX,
        y: evtMove.pageY
      };

      var newLeft = window.selectors.mainPin.offsetLeft - shift.x;
      var newTop = window.selectors.mainPin.offsetTop - shift.y;

      window.selectors.mainPin.style.left = newLeft + 'px';
      window.selectors.mainPin.style.top = newTop + 'px';
      window.selectors.addressInput.value = window.map.getCoordsPin(window.selectors.mainPin.offsetLeft, window.selectors.mainPin.offsetTop, window.service.MAIN_PIN_WIDTH, window.service.MAIN_PIN_HEIGHT + window.service.MAIN_PIN_TALE);
    };

    var onMainPinDrop = function (evtUp) {
      evtUp.preventDefault();
      if (!checkMapActivate()) {
        activateMap();
      }
      document.removeEventListener('mousemove', onMainPinMove);
      document.removeEventListener('mouseup', onMainPinDrop);

    };
    document.addEventListener('mousemove', onMainPinMove);
    document.addEventListener('mouseup', onMainPinDrop);
  });

  // Переменные и функции для состояния disable формы подачи объявления
  var fieldsetList = document.querySelectorAll('fieldset');

  var disableForm = function () {
    for (var i = 0; i < fieldsetList.length; i++) {
      fieldsetList[i].setAttribute('disabled', 'true');
    }
  };
  disableForm();

  var enableForm = function () {
    for (var i = 0; i < fieldsetList.length; i++) {
      fieldsetList[i].removeAttribute('disabled');
    }
  };
})();

