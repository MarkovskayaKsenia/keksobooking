'use strict';

// Функция рассчета координат уже установленной метки
var getCoordsPin = function (x, y, pinWidth, pinHeight) {
  var coordsX = Math.round(x + pinWidth / 2);
  var coordsY = Math.round(y + pinHeight);
  return coordsX + ', ' + coordsY;
};

// Находим место для вставки карточки и шаблон
var map = document.querySelector('.map');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var adTemplate = document.querySelector('template').content.querySelector('.popup');

// Вставка объявления на страницу
var insertAdvertisement = function (obj) {
  var adElement = window.advertisement.renderAdvertisement(obj);
  map.insertBefore(adElement, mapFiltersContainer);

  var popupButtonClose = document.querySelector('.popup__close');
  popupButtonClose.addEventListener('click', closeCard);

  map.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.service.ESC_CODE) {
      closeCard();
    }
  });
};

// Закрытие объявления
var closeCard = function () {
  var mapCard = document.querySelector('.map__card');
  if (mapCard) {
    mapCard.remove();
  }
};

// Находим место для вставки пинов и шаблон
var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

// Функция отрисовки одного пина
var renderPin = function (obj) {
  var pinNew = pinTemplate.cloneNode(true);
  pinNew.querySelector('img').src = obj.author.avatar;
  pinNew.style.left = obj.location.x + 'px';
  pinNew.style.top = obj.location.y + 'px';
  return pinNew;
};

// Слушатель клика по пину.
var addClickListener = function (elem, obj) {
  elem.addEventListener('click', function (evt) {
    closeCard();
    insertAdvertisement(obj);
  });
};

// Вставка пинов на карту
var insertPins = function (arr) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < arr.length; i++) {
    var pinElement = renderPin(arr[i]);
    addClickListener(pinElement, arr[i]);
    fragment.appendChild(pinElement);
  }
  mapPins.appendChild(fragment);
};

// Находим главный пин и форму
var mainPinDefaultX = window.selectors.mainPin.offsetLeft;
var mainPinDefaultY = window.selectors.mainPin.offsetTop;
window.selectors.addressInput.value = getCoordsPin(mainPinDefaultX, mainPinDefaultY, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT / 2);

//Ограничиваем перемещение главного Пина границами карты.
var mapWidth = map.offsetWidth;
var minLeftCoord = 0 - window.data.MAIN_PIN_WIDTH / 2;
var maxLeftCoord = mapWidth - window.data.MAIN_PIN_WIDTH / 2;
var minTopCoord = window.data.MIN_Y - window.data.MAIN_PIN_HEIGHT - window.data.MAIN_PIN_TALE;
var maxTopCoord = window.data.MAX_Y - window.data.MAIN_PIN_HEIGHT - window.data.MAIN_PIN_TALE;

var limitMainPinMove = function(newLeft, newTop) {
  if(newLeft < minLeftCoord || newLeft > maxLeftCoord || newTop < minTopCoord || newTop > maxTopCoord) {
    return true;
  }
  return false;
};

//Функция проверки активности карты
var checkMapActivate = function() {
   return !map.classList.contains('map--faded');
};

// Активация карты
var activateMap = function () {
  enableForm();
  map.classList.remove('map--faded');
  window.selectors.adForm.classList.remove('ad-form--disabled');
  insertPins(window.advertisement.adList);
  window.selectors.addressInput.value = getCoordsPin(mainPinDefaultX, mainPinDefaultY, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT + window.data.MAIN_PIN_TALE);
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

    if(limitMainPinMove(window.selectors.mainPin.offsetLeft - shift.x, window.selectors.mainPin.offsetTop - shift.y)) {
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
    window.selectors.addressInput.value = getCoordsPin(window.selectors.mainPin.offsetLeft, window.selectors.mainPin.offsetTop, window.data.MAIN_PIN_WIDTH, window.data.MAIN_PIN_HEIGHT + window.data.MAIN_PIN_TALE);
  };

  var onMainPinDrop = function(evtUp) {
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
