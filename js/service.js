'use strict';
(function(){
  window.service = {
    // Функция нахождения случайного числа в заданном интервале
    getRandomFromInterval: function (min, max) {
      return Math.floor((max + 1 - min) * Math.random() + min);
    },
    // Функция перемешивания элементов массива в случайном порядке. Исходный массив не меняется.
    randomizeArrayElements: function (arr) {
      var newArr = arr.slice(0);

      newArr.sort(function () {
        return 0.5 - Math.random();
      });
      return newArr;
    },
    // Функция создания массива случайной длины и случайных значений из элементов другого массива
    getRandomArrLength: function (arr) {
      var rezult = [];
      var newArr = window.service.randomizeArrayElements(arr);
      var rezultLength = window.service.getRandomFromInterval(0, arr.length - 1);
      for (var i = 0; i < rezultLength; i++) {
        rezult[i] = newArr[i];
      }
      return rezult;
    },

    ESC_CODE: 27
  };

})();

