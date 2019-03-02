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

var MIN_LOCATION_X = 300;
var MAX_LOCATION_X = 900;
var MIN_LOCATION_Y = 130;
var MAX_LOCATION_Y = 630;


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

// Функция создания массива случайной длины и случайных значений, на основе уже существующего массива
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
var getPinX = function(coordinateX,pinWidth) {
  return coordinateX + pinWidth / 2;
}

// Функция создание массива объектов

var createAdList = function (quantity, titles, types, minPrice, maxPrice, minRooms, maxRooms, minGuests, maxGuests, minCheck, maxCheck, features, photos) {
  var adList = [];
  var randTitles = randomizeArrayElements(titles);

  for (var i = 0; i < quantity; i++) {
    var adElem = {};

    adElem.author = {};
    adElem.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

    adElem.offer = {};
    adElem.offer.titles = randTitles[i];
    adElem.offer.types = types[getRandomFromInterval(0, types.length - 1)];
    adElem.offer.price = getRandomFromInterval(minPrice, maxPrice);
    adElem.offer.rooms = getRandomFromInterval(minRooms, maxRooms);
    adElem.offer.guests = getRandomFromInterval(minGuests, maxGuests);
    adElem.offer.checkin = getRandomFromInterval(minCheck, maxCheck) + ':00';
    adElem.offer.checkout = getRandomFromInterval(minCheck, maxCheck) + ':00';
    adElem.offer.features = getRandomArrLength(features);
    adElem.offer.description = '';
    adElem.offer.photos = randomizeArrayElements(photos);

    adElem.location = {};
    adElem.location.x = ;
    adElem.location.y = ;

    adList.push(adElem);
  }
  return adList;
};

console.log(createAdList(QUANTITY, TITLES, TYPES, MIN_PRICE, MAX_PRICE, MIN_ROOMS, MAX_ROOMS, MIN_GUESTS, MAX_GUESTS, MIN_CHECK, MAX_CHECK, FEATURES, PHOTOS));

var map = document.querySelector('.map');
map.classList.remove('map--faded');
