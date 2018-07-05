'use strict';

(function () {
  window.utils = {
    ESC_CODE: 27,
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
    // Функция для очистки пинов с карты
    clearPins: function () {
      var currentPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

      for (var i = 0; i < currentPins.length; i++) {
        currentPins[i].remove();
      }
    },
    // Функция для закрытия карточки объявления
    closeCard: function () {
      var card = document.querySelector('.map__card');
      if (card) {
        card.remove();
      }
    },
    // Сообщения об ошибке и отправке формы
    onError: function (error) {
      var errorWindow = document.querySelector('.error');
      var errorText = document.querySelector('.error__message span');

      errorText.textContent = error;
      errorWindow.classList.remove('hidden');

      errorWindow.addEventListener('click', function () {
        errorWindow.classList.add('hidden');
      });
      errorWindow.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.utils.ESC_CODE && !(errorWindow.classList.contains('hidden'))) {
          errorWindow.classList.add('hidden');
        }
      });

      setTimeout(function () {
        if (!errorWindow.classList.contains('hidden')) {
          errorWindow.classList.add('hidden');
          setTimeout(window.mapDeactivate(), 500);
        }
      }, 4000);
    },
    onSubmit: function () {
      var successWindow = document.querySelector('.success');
      successWindow.classList.remove('hidden');

      successWindow.addEventListener('click', function () {
        successWindow.classList.add('hidden');
      });

      setTimeout(function () {
        if (!successWindow.classList.contains('hidden')) {
          successWindow.classList.add('hidden');
        }
      }, 4000);
    }
  };
})();
