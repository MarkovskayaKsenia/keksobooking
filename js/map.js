'use strict';

//  Константы
var QUANTITY = 8;
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;

var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;

var MIN_ROOMS = 1;
var MAX_ROOMS = 5;

var MIN_CHECK = 12;
var MAX_CHECK = 14;

var MIN_GUESTS = 0;
var MAX_GUESTS = 3;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_DEFAULT_LEFT = 570;
var MAIN_PIN_DEFAULT_TOP = 375;
var mapWorkspace = {
  startX: 0,
  startY: 130,
  endX: 1200,
  endY: 630
};

var ESC_CODE = 27;


// Функция для возвращения нового перемешанного массива
var randomMixArray = function (arr) {
  var newArr = arr.slice(0);

  newArr.sort(function () {
    return 0.5 - Math.random();
  });
  return newArr;
};

// Функция для генерации случайных чисел в интервале
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция для генерации массива произвольной длины из другого массива
var getRandomArrLength = function (arr) {
  var newArr = [];
  for (var i = getRandomInt(0, arr.length - 1); i >= 0; i--) {
    newArr[i] = arr[i];
  }
  return newArr;
};

// Функции для определения положения метки
var getPinX = function (x, pinWidth) {
  return x - pinWidth / 2;
};
var getPinY = function (y, pinHeight) {
  return y - pinHeight;
};
var getCoordsPin = function (x, y, pinWidth, pinHeight) {
  return getPinX(x, pinWidth) + ', ' + getPinY(y, pinHeight);
};

// Функция для генерации массива объектов объявлений
var createAdList = function (quantity, titles, types, minX, minY, maxX, maxY, minPrice, maxPrice, minRooms, maxRooms, minGuests, maxGuests, minCheck, maxCheck, features, photos, pinWidth, pinHeight) {
  var ads = [];
  var mixedTitles = randomMixArray(titles);

  for (var i = 0; i < quantity; i++) {
    var ad = {};
    var x = getRandomInt(minX, maxX);
    var y = getRandomInt(minY, maxY);

    ad.author = {};
    ad.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    ad.offer = {};
    ad.offer.title = mixedTitles[i];
    ad.offer.addres = getCoordsPin(x, y, PIN_WIDTH, PIN_HEIGHT);
    ad.offer.price = getRandomInt(minPrice, maxPrice);
    ad.offer.type = types[getRandomInt(0, types.length - 1)];
    ad.offer.rooms = getRandomInt(minRooms, maxRooms);
    ad.offer.guests = getRandomInt(minGuests, maxGuests);
    ad.offer.checkin = getRandomInt(minCheck, maxCheck) + ':00';
    ad.offer.checkout = getRandomInt(minCheck, maxCheck) + ':00';
    ad.offer.features = getRandomArrLength(randomMixArray(features));
    ad.offer.description = '';
    ad.offer.photos = randomMixArray(photos);

    ad.location = {};
    ad.location.x = getPinX(x, pinWidth);
    ad.location.y = getPinY(y, pinHeight);

    ads.push(ad);
  }
  return ads;
};

// создаем массив объектов
var adList = createAdList(QUANTITY, TITLES, TYPES, MIN_X, MIN_Y, MAX_X, MAX_Y, MIN_PRICE, MAX_PRICE, MIN_ROOMS, MAX_ROOMS, MIN_GUESTS, MAX_GUESTS, MIN_CHECK, MAX_CHECK, FEATURES, PHOTOS, PIN_WIDTH, PIN_HEIGHT);

// Находим место для вставки карточки и шаблон
var map = document.querySelector('.map');
var cardPlace = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');

// Функция для удаления дочерних элементов
var removeChildren = function (list) {
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
};

// Функция для перевода типа апартаментов
var localizeType = function (type) {
  switch (type) {
    case 'flat' : return 'Квартира';
    case 'bungalo' : return 'Бунгало';
    case 'house' : return 'Дом';
    default : return 'Дворец';
  }
};

// Функция для отрисовки одного объявления.
var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.addres;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price;
  cardElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', '&#x20bd;<span>/ночь</span>');
  cardElement.querySelector('.popup__type').textContent = localizeType(card.offer.type);
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

  var featureList = cardElement.querySelector('.popup__features');
  var features = card.offer.features;
  removeChildren(featureList);
  for (var i = 0; i < features.length; i++) {
    var newFeature = document.createElement('li');
    newFeature.classList.add('popup__feature');
    newFeature.classList.add('popup__feature--' + features[i]);
    featureList.appendChild(newFeature);
  }
  cardElement.querySelector('.popup__description').textContent = card.offer.description;

  var photoBlock = cardElement.querySelector('.popup__photos');
  var defaultPhoto = cardElement.querySelector('.popup__photo');
  photoBlock.removeChild(defaultPhoto);
  for (var j = 0; j < card.offer.photos.length; j++) {
    var newPhoto = defaultPhoto.cloneNode(defaultPhoto);
    newPhoto.src = card.offer.photos[j];
    photoBlock.appendChild(newPhoto);
  }

  var buttonClose = cardElement.querySelector('.popup__close');
  buttonClose.addEventListener('click', closeCard);
  map.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_CODE) {
      closeCard();
    }
  });

  return cardElement;
};

// Функция для удаления объявления
var closeCard = function () {
  var card = document.querySelector('.map__card');
  if (card) {
    card.remove();
  }
};

// Находим место для вставки пинов и шаблон
var pinsPlace = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template')
  .content
  .querySelector('.map__pin');

// Функция для отрисовки пина
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinAvatar = pinElement.querySelector('img');
  pinElement.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
  pinAvatar.src = pin.author.avatar;
  pinAvatar.alt = pin.offer.title;
  pinElement.addEventListener('click', function () {
    closeCard();
    map.insertBefore(renderCard(pin), cardPlace);
  });
  return pinElement;
};

// Создаем фрагмент, добавляем в него пины
var pinsFragment = document.createDocumentFragment();
for (var i = 0; i < adList.length; i++) {
  var pin = renderPin(adList[i]);
  pinsFragment.appendChild(pin);
}

// Переменные и функции для disable
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
var mainPin = document.querySelector('.map__pin--main');
var mapWindow = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var addresInput = adForm.querySelector('#address');
addresInput.value = getCoordsPin(mainPin.offsetLeft, mainPin.offsetTop, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2);

// Функция для проверки активности карты
var checkMapActive = function () {
  if (mapWindow.classList.contains('map--faded')) {
    return false;
  } else {
    return true;
  }
};

// функция установки главной метки в исходное значение
var setMainPinDefault = function () {
  mainPin.style.left = MAIN_PIN_DEFAULT_LEFT + 'px';
  mainPin.style.top = MAIN_PIN_DEFAULT_TOP + 'px';
  addresInput.value = getCoordsPin(mainPin.offsetLeft, mainPin.offsetTop, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
};

// Функция для активации карты
var mapActivate = function () {
  enableForms();
  mapWindow.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  pinsPlace.appendChild(pinsFragment);
};

mainPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {


    moveEvt.preventDefault();
    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };
    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var currentCoords = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    if (currentCoords.x < mapWorkspace.startX) {
      currentCoords.x = mapWorkspace.startX;
    } else if (currentCoords.x > (mapWorkspace.endX - MAIN_PIN_WIDTH)) {
      currentCoords.x = mapWorkspace.endX - MAIN_PIN_WIDTH;
    }
    if (currentCoords.y < mapWorkspace.startY) {
      currentCoords.y = mapWorkspace.startY;
    } else if (currentCoords.y > mapWorkspace.endY) {
      currentCoords.y = mapWorkspace.endY;
    }

    mainPin.style.left = currentCoords.x + 'px';
    mainPin.style.top = currentCoords.y + 'px';
    addresInput.value = getCoordsPin(currentCoords.x, currentCoords.y, MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT);
  };
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    if (!checkMapActive()) {
      mapActivate();
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

});

// Начинаем валидацию формы

var typeSelect = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var timeInSelect = adForm.querySelector('#timein');
var timeOutSelect = adForm.querySelector('#timeout');
var roomsSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');

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
adForm.addEventListener('reset', function () {
  setTimeout(setMainPinDefault, 50);
});
