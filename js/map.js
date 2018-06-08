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

// Функция для возвращения нового перемешанного массива
var randomMixArray = function (arr) {
  // я тут не была уверена, что можно менять исходный массив, поэтому сначала его скопировала, а потом перемешала
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr[i] = arr [i];
  }

  newArr.sort(function () {
    return 0.5 - Math.random();
  });
  return newArr;
};

// Функция для генерации случайных чисел в интервале
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция для вывода случайного элемента из массива
var getRandomFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Функция для генерации массива произвольной длины из другого массива
var getRandomArrLength = function (arr) {
  var newArr = [];
  for (var i = getRandomInt(1, arr.length); i >= 0; i--) {
    newArr[i] = arr[i];
  }

  return newArr;
};

// Функция для генерации массива объектов объявлений
var createAdList = function (quantity, titles, types, minX, minY, maxX, maxY, minPrice,
    maxPrice, minRooms, maxRooms, minGuests,
    maxGuests, minCheck, maxCheck, features, photos) {
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
    ad.offer.type = getRandomFromArray(types);
    ad.offer.rooms = getRandomInt(minRooms, maxRooms);
    ad.offer.guests = getRandomInt(minGuests, maxGuests);
    ad.offer.checkin = getRandomInt(minCheck, maxCheck) + ':00';
    ad.offer.checkout = getRandomInt(minCheck, maxCheck) + ':00';
    ad.offer.features = getRandomArrLength(features);
    ad.offer.description = '';
    ad.offer.photos = randomMixArray(photos);

    ad.location = {};
    ad.location.x = x;
    ad.location.y = y;

    ads.push(ad);
  }

  return ads;
};


// создаем массив объектов
var adList = createAdList(QUANTITY, TITLES, TYPES, MIN_X, MIN_Y, MAX_X, MAX_Y, MIN_PRICE, MAX_PRICE, MIN_ROOMS, MAX_ROOMS, MIN_GUESTS, MAX_GUESTS, MIN_CHECK, MAX_CHECK, FEATURES, PHOTOS);

// Показываем блок .map
var mapWindow = document.querySelector('.map');
mapWindow.classList.remove('map--faded');

// Находим место для вставки пинов и шаблон
var pinPlace = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');


// функция для отрисовки одного объявления.
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.querySelector('.popup__avatar').setAttribute('src', pin.author.avatar);
  pinElement.querySelector('.popup__title').textContent = pin.offer.title;
  pinElement.querySelector('.popup__text--address').textContent = pin.offer.addres;
  pinElement.querySelector('.popup__text--price').textContent = pin.offer.price;
  pinElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', ' &#x20bd;<span>/ночь</span>');
  pinElement.querySelector('.popup__type').textContent = pin.offer.type;
  pinElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;

  var featureList = document.querySelector('.popup__features');
  var features = document.querySelectorAll('.popup__feature');

  // придумать как выводить только нужные li


  pinElement.querySelector('.popup__description').textContent = pin.offer.description;

  var photoBlock = pinElement.querySelector('.popup__photos');
  var defaultPhoto = pinElement.querySelector('.popup__photo');
  photoBlock.removeChild(defaultPhoto);
  for (var i = 0; i < pin.offer.photos.length; i++) {
    var newPhoto = defaultPhoto.cloneNode(defaultPhoto);
    newPhoto.src = pin.offer.photos[i];
    photoBlock.appendChild(newPhoto);
  }

  return pinElement;
};

// создаем фрагмент и добавляем в него элементы
var fragment = document.createDocumentFragment();

fragment.appendChild(renderPin(adList[0]));


pinPlace.appendChild(fragment);
console.log(adList);
