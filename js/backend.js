'use strict';
(function () {
  var listenRequest = function (xhr, onLoad, onError, reaction) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
        if (reaction) {
          reaction();
        }
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
    });
  };
  window.backend = {
    save: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = 10000;
      listenRequest(xhr, onLoad, onError, window.utils.onSubmit);
      xhr.open('POST', URL);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = 10000;
      listenRequest(xhr, onLoad, onError, null);
      xhr.open('GET', URL);
      xhr.send();
    }
  };
})();
