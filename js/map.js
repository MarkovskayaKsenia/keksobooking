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
var MAX_GUESTS = 10;

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

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
    ad.offer.addres = x + ', ' + y;
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

// Показываем блок .map
var mapWindow = document.querySelector('.map');
mapWindow.classList.remove('map--faded');

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
  var localType = '';
  switch (type) {
    case 'flat' : localType = 'Квартира';
      break;
    case 'bungalo' : localType = 'Бунгало';
      break;
    case 'house' : localType = 'Дом';
      break;
    case 'palace' : localType = 'Дворец';
      break;
    default : localType = 'Хибарка';
  }

  return localType;
};

// Функция для отрисовки одного объявления.
var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);
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

  return cardElement;
};

// // Вставляем карту перед указанным блоком
map.insertBefore(renderCard(adList[0]), cardPlace);

// // Находим место для вставки пинов и шаблон
var pinsPlace = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template')
  .content
  .querySelector('.map__pin');

// Функция для отрисовки пина
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.style = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

// Создаем фрагмент, добавляем в него пины, добавляем его в DOM
var fragment = document.createDocumentFragment();
for (var i = 0; i < adList.length; i++) {
  var pin = renderPin(adList[i]);
  fragment.appendChild(pin);
}
pinsPlace.appendChild(fragment);
