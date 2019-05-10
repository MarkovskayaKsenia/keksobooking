'use strict';

(function(){

// Функции для установки положения метки на основе координат
  var getPinX = function (x, pinWidth) {
    return x - pinWidth / 2;
  };

  var getPinY = function (y, pinHeight) {
    return y - pinHeight;
  };

  // Функция создания массива объектов
  var createAdList = function (quantity, title, types, minPrice, maxPrice, minRooms, maxRooms, minGuests, maxGuests, minCheck, maxCheck, features, photos, minX, maxX, minY, maxY, pinWidth, pinHeight) {
    var adList = [];
    var randTitles = window.service.randomizeArrayElements(title);

    for (var i = 0; i < quantity; i++) {
      var adElem = {};
      var x = window.service.getRandomFromInterval(minX, maxX);
      var y = window.service.getRandomFromInterval(minY, maxY);

      adElem.author = {};
      adElem.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

      adElem.offer = {};
      adElem.offer.title = randTitles[i];
      adElem.offer.address = x + ', ' + y;
      adElem.offer.type = types[window.service.getRandomFromInterval(0, types.length - 1)];
      adElem.offer.price = window.service.getRandomFromInterval(minPrice, maxPrice);
      adElem.offer.rooms = window.service.getRandomFromInterval(minRooms, maxRooms);
      adElem.offer.guests = window.service.getRandomFromInterval(minGuests, maxGuests);
      adElem.offer.checkin = window.service.getRandomFromInterval(minCheck, maxCheck) + ':00';
      adElem.offer.checkout = window.service.getRandomFromInterval(minCheck, maxCheck) + ':00';
      adElem.offer.features = window.service.getRandomArrLength(features);
      adElem.offer.description = '';
      adElem.offer.photos = window.service.randomizeArrayElements(photos);

      adElem.location = {};
      adElem.location.x = getPinX(x, pinWidth);
      adElem.location.y = getPinY(y, pinHeight);

      adList.push(adElem);
    }
    return adList;
  };

  // Локализация типов жилья
  var localizeTypes = function (str) {
    switch (str) {
      case 'palace' : return 'Дворец';
      case 'flat' : return 'Квартира';
      case 'house' : return 'Дом';
      case 'bungalo' : return 'Бунгало';
    }
  };

// Удаление дочерних элементов
  var removeChildren = function (list) {
    while (list.hasChildNodes()) {
      list.removeChild(list.firstChild);
    }
  };

  // Удобства жилья: случайный набор в случайном порядке
  var renderAdFeaturesList = function (listAd) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < listAd.length; i++) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + listAd[i]);
      fragment.appendChild(li);
    }
    return fragment;
  };

// Фотографии объявления в случайном порядке
  var renderAdPhotos = function (Temp, photoList) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photoList.length; i++) {
      var img = Temp.cloneNode(true);
      img.src = photoList[i];
      fragment.appendChild(img);
    }
    return fragment;
  };

  window.advertisement = {
    // Генерация массива с данными объявления
    adList: createAdList(window.data.QUANTITY, window.data.TITLES, window.data.TYPES, window.data.MIN_PRICE, window.data.MAX_PRICE, window.data.MIN_ROOMS, window.data.MAX_ROOMS, window.data.MIN_GUESTS, window.data.MAX_GUESTS, window.data.MIN_CHECK, window.data.MAX_CHECK, window.data.FEATURES, window.data.PHOTOS, window.data.MIN_X, window.data.MAX_X, window.data.MIN_Y, window.data.MAX_Y, window.data.PIN_WIDTH, window.data.PIN_HEIGHT),
    // Отрисовка шаблона объявления
    renderAdvertisement: function (obj) {
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
      adNew.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout;
      removeChildren(featuresTemp);
      featuresTemp.appendChild(renderAdFeaturesList(obj.offer.features));
      adNew.querySelector('.popup__description').textContent = obj.offer.description;
      removeChildren(photosList);
      photosList.appendChild(renderAdPhotos(photoTemp, obj.offer.photos));

      return adNew;
    }
  };
})();
