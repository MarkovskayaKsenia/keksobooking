'use strict';

(function () {
  window.utils = {
    // Функция для возвращения нового перемешанного массива
    randomMixArray: function (arr) {
      var newArr = arr.slice(0);

      newArr.sort(function () {
        return 0.5 - Math.random();
      });
      return newArr;
    },
    // Функция для генерации случайных чисел в интервале
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // Функция для генерации массива произвольной длины из другого массива
    getRandomArrLength: function (arr) {
      var newArr = [];
      for (var i = window.utils.getRandomInt(0, arr.length - 1); i >= 0; i--) {
        newArr[i] = arr[i];
      }
      return newArr;
    },
    // Функции для определения положения метки
    getPinX: function (x, pinWidth) {
      return x + pinWidth / 2;
    },
    getPinY: function (y, pinHeight) {
      return y + pinHeight;
    },
    getCoordsPin: function (x, y, pinWidth, pinHeight) {
      return this.getPinX(x, pinWidth) + ', ' + this.getPinY(y, pinHeight);
    },
    // Функция для удаления дочерних элементов
    removeChildren: function (list) {
      while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
      }
    },
    ESC_CODE: 27,
    MAIN_PIN_HEIGHT: 65,
    MAIN_PIN_WIDTH: 65,
    MAIN_PIN_TALE: 21,
    MAIN_PIN_DEFAULT_LEFT: 570,
    MAIN_PIN_DEFAULT_TOP: 375
  };
})();
