'use strict';

// Создадим массивы для значений объектов

var getAvatars = function (num) {
  var arr = [];
  for (var i = 1; i <= num; i++) {
    arr.push('0' + i);
  }

  return arr;
};

var QUANTITY = 8;
var avatars = getAvatars(QUANTITY);
console.log(avatars);

// Описания квартир и функция их случайного порядка без повторений
var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var randomizeNoRepeatArray = function (arr) {
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


console.log(randomizeNoRepeatArray(titles));
console.log(titles);


// Функция для генерации случайных чисел в интервале
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Генерим координаты
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;
var randomLocation = getRandomInt(MIN_X, MAX_X) + ', ' + getRandomInt(MIN_Y, MAX_Y);
console.log(randomLocation);


// Генерим цену
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var price = getRandomInt(MIN_PRICE, MAX_PRICE);
console.log(price);

// Генерим количество комнат
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var rooms = getRandomInt(MIN_ROOMS, MAX_ROOMS);
console.log(rooms);

// Генерим время заезда и выезда
var MIN_CHECK = 12;
var MAX_CHECK = 14;
var checkin = getRandomInt(MIN_CHECK, MAX_CHECK) + ':00';
var checkout = getRandomInt(MIN_CHECK, MAX_CHECK) + ':00';

console.log(checkin, ' ', checkout);

// Генерим массив строк случайной длины из предложенных
var defaultFeatures = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var randomFeatures = function (arr) {
  var newArr = [];
  for (var i = getRandomInt(1, arr.length); i >= 0; i--) {
    newArr[i] = arr[i];
  }

  return newArr;
};

console.log(randomFeatures(defaultFeatures));

// Располагаем фото в случайном порядке

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var sortPhotos = randomizeNoRepeatArray(photos);
console.log(sortPhotos);

var guests = getRandomInt(1, 100);

// создаем объекты
