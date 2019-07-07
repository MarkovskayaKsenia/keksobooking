'use strict';
(function () {
  var ESC_CODE = 27;
  window.service = {
    // Проверка на нажатие клавиши ESC
    isEscKeycode: function (evt) {
      return evt.keyCode === ESC_CODE;
    },
    onError: function (error) {
      var errorWindow = document.querySelector('.error');
      var errorText = document.querySelector('.error__message span');
      errorText.textContent = error;
      errorText.style.color = 'red';
      errorText.style.fontWeight = 'bold';
      errorText.style.fontSize = '24px';
      errorWindow.classList.remove('hidden');
      errorWindow.addEventListener('click', function () {
        errorWindow.classList.add('hidden');
      });
      document.addEventListener('keydown', function () {
        if (window.service.isEscKeycode && !(errorWindow.classList.contains('hidden'))) {
          errorWindow.classList.add('hidden');
        }
      });
      setTimeout(function () {
        errorWindow.classList.add('hidden');
      }, 4000);
    },
    onSubmit: function () {
      var successWindow = document.querySelector('.success');
      successWindow.classList.remove('hidden');
      setTimeout(function() {
        successWindow.classList.add('hidden');
      }, 4000);
    },
    MAIN_PIN_HEIGHT: 65,
    MAIN_PIN_WIDTH: 65,
    MAIN_PIN_TALE: 22
  };

})();

