'use strict';

// Константы

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

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg'
];

var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;

var MIN_ROOMS = 1;
var MAX_ROOMS = 5;

var MIN_GUESTS = 1;
var MAX_GUESTS = 10;

var MIN_CHECK = 12;
var MAX_CHECK = 13;

var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;


// Функция нахождения случайного числа в заданном интервале
var getRandomFromInterval = function (min, max) {
  return Math.floor((max + 1 - min) * Math.random() + min);
};

// Функция перемешивания элементов массива в случайном порядке. Исходный массив не меняется.
var randomizeArrayElements = function (arr) {
  var newArr = arr.slice(0);

  newArr.sort(function () {
    return 0.5 - Math.random();
  });
  return newArr;
};

// Функция создания массива случайной длины и случайных значений из элементов другого массива
var getRandomArrLength = function (arr) {
  var rezult = [];
  var newArr = randomizeArrayElements(arr);
  var rezultLength = getRandomFromInterval(0, arr.length - 1);
  for(var i = 0; i < rezultLength; i++) {
    rezult[i] = newArr[i];
  };
  return rezult;
};

//Функции для определения положения метки
var getPinX = function(x, pinWidth) {
  return x - pinWidth / 2;
};

var getPinY = function (y, pinHeight) {
  return y - pinHeight;
};

// Функция создания массива объектов
var createAdList = function (quantity, title, types, minPrice, maxPrice, minRooms, maxRooms, minGuests, maxGuests, minCheck, maxCheck, features, photos, minX, maxX, minY, maxY, pinWidth, pinHeight) {
  var adList = [];
  var randTitles = randomizeArrayElements(title);

  for (var i = 0; i < quantity; i++) {
    var adElem = {};
    var x = getRandomFromInterval(minX, maxX);
    var y = getRandomFromInterval(minY, maxY);

    adElem.author = {};
    adElem.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    adElem.offer = {};
    adElem.offer.title = randTitles[i];
    adElem.offer.address = x + ', ' + y;
    adElem.offer.type = types[getRandomFromInterval(0, types.length - 1)];
    adElem.offer.price = getRandomFromInterval(minPrice, maxPrice);
    adElem.offer.rooms = getRandomFromInterval(minRooms, maxRooms);
    adElem.offer.guests = getRandomFromInterval(minGuests, maxGuests);
    adElem.offer.checkin = getRandomFromInterval(minCheck, maxCheck) + ':00';
    adElem.offer.checkout = getRandomFromInterval(minCheck, maxCheck) + ':00';
    adElem.offer.features = getRandomArrLength(features);
    adElem.offer.description = '';
    adElem.offer.photos = randomizeArrayElements(photos);

    adElem.location = {};
    adElem.location.x = getPinX(x, pinWidth);
    adElem.location.y = getPinY(y, pinHeight);

    adList.push(adElem);
  }
  return adList;
};

//Генерация массива с данными объявления
var adList = createAdList(QUANTITY, TITLES, TYPES, MIN_PRICE, MAX_PRICE, MIN_ROOMS, MAX_ROOMS, MIN_GUESTS, MAX_GUESTS, MIN_CHECK, MAX_CHECK, FEATURES, PHOTOS, MIN_X, MAX_X, MIN_Y, MAX_Y, PIN_WIDTH, PIN_HEIGHT);

//Включаем отображение карты
var map = document.querySelector('.map');
map.classList.remove('map--faded');

//Функция отрисовки пина
var renderPin = function (obj) {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var pinNew = pinTemplate.cloneNode(true);
  pinNew.querySelector('img').src = obj.author.avatar;
  pinNew.style.left = obj.location.x + 'px';
  pinNew.style.top = obj.location.y + 'px';
  return pinNew;
};

//Вставка пинов на карту
var insertPins = function (arr) {
  var fragment = document.createDocumentFragment();

  var mapPins = document.querySelector('.map__pins');
  for (var i = 0; i < arr.length; i++) {
   var pinElement = renderPin(arr[i]);
    fragment.appendChild(pinElement);
  }
  mapPins.appendChild(fragment);
};

//Локализация типов жилья

var localizeTypes = function(str) {
  switch(str) {
    case 'palace' : return 'Дворец';
    case 'flat' : return 'Квартира';
    case 'house' : return 'Дом';
    case 'bungalo' : return 'Бунгало';
  }
};

//Удаление дочерних элементов
var removeChildren = function(list) {
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
};

var renderAdFeaturesList = function(listAd) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < listAd.length; i++) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + listAd[i]);
    fragment.appendChild(li);
  }
  return fragment;
};

var renderAdPhotos = function (Temp, photoList) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photoList.length; i++) {
    var img = Temp.cloneNode(true);
    img.src = photoList[i];
    fragment.appendChild(img);
  }
  return fragment;
};

//Отрисовка шаблона объявления
var renderAdvertisement = function (obj) {
  var adTemplate = document.querySelector('template').content.querySelector('.popup');
  var adNew = adTemplate.cloneNode(true);
  var featuresTemp = adNew.querySelector('.popup__features');
  var photosList = adNew.querySelector('.popup__photos');
  var photoTemp = photosList.querySelector('img');

  adNew.querySelector('.popup__avatar').src = obj.author.avatar;
  adNew.querySelector('.popup__title').textContent = obj.offer.title;
  adNew.querySelector('.popup__text--address').textContent = obj.offer.address;
  adNew.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь';
  adNew.querySelector('.popup__type').textContent = localizeTypes(obj.offer.type);
  adNew.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей';
  adNew.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ", выезд до " + obj.offer.checkout;
  removeChildren(featuresTemp);
  featuresTemp.appendChild(renderAdFeaturesList(obj.offer.features));
  adNew.querySelector('.popup__description').textContent = obj.offer.description;
  removeChildren(photosList);
  photosList.appendChild(renderAdPhotos(photoTemp, obj.offer.photos));

  return adNew;
};

//Вставка объявления на страницу
var insertAdvertisement = function(parentT, obj) {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var adElement = renderAdvertisement(obj);
  parentT.insertBefore(adElement, mapFiltersContainer);

};

insertPins(adList);

insertAdvertisement(map, adList[0]);
