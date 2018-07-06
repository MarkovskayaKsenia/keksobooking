'use strict';
(function () {
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var URL_GET = 'https://js.dump.academy/keksobooking/data';
  var currentType = 'json';
  var currentTimeout = 10000;

  var request = function (url, xhr, type, timeout, onLoad, onError, method, data) {
    xhr.responseType = type;
    xhr.timeout = timeout;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
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

    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      request(URL_POST, xhr, currentType, currentTimeout, onLoad, onError, 'POST', data);
    },

    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      request(URL_GET, xhr, currentType, currentTimeout, onLoad, onError, 'GET', null);
    }
  };
})();
