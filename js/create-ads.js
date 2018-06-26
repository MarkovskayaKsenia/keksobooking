'use strict';
(function () {
  // Функция для генерации массива объектов объявлений
  var createAdList = function (quantity, titles, types, minX, minY, maxX, maxY, minPrice, maxPrice, minRooms, maxRooms, minGuests, maxGuests, minCheck, maxCheck, features, photos, pinWidth, pinHeight) {
    var ads = [];
    var mixedTitles = window.utils.randomMixArray(titles);

    for (var i = 0; i < quantity; i++) {
      var ad = {};
      var x = window.utils.getRandomInt(minX + pinWidth / 2, maxX + pinWidth / 2);
      var y = window.utils.getRandomInt(minY - pinHeight, maxY - pinHeight);

      ad.author = {};
      ad.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';

      ad.offer = {};
      ad.offer.title = mixedTitles[i];
      ad.offer.addres = window.utils.getCoordsPin(x, y, pinWidth, pinHeight);
      ad.offer.price = window.utils.getRandomInt(minPrice, maxPrice);
      ad.offer.type = types[window.utils.getRandomInt(0, types.length - 1)];
      ad.offer.rooms = window.utils.getRandomInt(minRooms, maxRooms);
      ad.offer.guests = window.utils.getRandomInt(minGuests, maxGuests);
      ad.offer.checkin = window.utils.getRandomInt(minCheck, maxCheck) + ':00';
      ad.offer.checkout = window.utils.getRandomInt(minCheck, maxCheck) + ':00';
      ad.offer.features = window.utils.getRandomArrLength(window.utils.randomMixArray(features));
      ad.offer.description = '';
      ad.offer.photos = window.utils.randomMixArray(photos);

      ad.location = {};
      ad.location.x = window.utils.getPinX(x, pinWidth);
      ad.location.y = window.utils.getPinY(y, pinHeight);

      ads.push(ad);
    }
    return ads;
  };

  // Cоздаем массив объектов объявлений
  var adList = createAdList(window.data.QUANTITY, window.data.TITLES, window.data.TYPES, window.data.MIN_X, window.data.MIN_Y, window.data.MAX_X, window.data.MAX_Y, window.data.MIN_PRICE, window.data.MAX_PRICE, window.data.MIN_ROOMS, window.data.MAX_ROOMS, window.data.MIN_GUESTS, window.data.MAX_GUESTS, window.data.MIN_CHECK, window.data.MAX_CHECK, window.data.FEATURES, window.data.PHOTOS, window.data.PIN_WIDTH, window.data.PIN_HEIGHT);

  // Находим место для вставки карточки и шаблон
  var map = document.querySelector('.map');
  var cardPlace = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('template')
    .content
    .querySelector('.map__card');

  // Функция для перевода типа апартаментов
  var localizeType = function (type) {
    switch (type) {
      case 'flat' : return 'Квартира';
      case 'bungalo' : return 'Бунгало';
      case 'house' : return 'Дом';
      default : return 'Дворец';
    }
  };

  // Функция для отрисовки одного объявления.
  var renderCard = function (card) {
    var cardElement = cardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__avatar').src = card.author.avatar;
    cardElement.querySelector('.popup__title').textContent = card.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = card.offer.addres;
    cardElement.querySelector('.popup__text--price').textContent = card.offer.price;
    cardElement.querySelector('.popup__text--price').insertAdjacentHTML('beforeend', '&#x20bd;<span>/ночь</span>');
    cardElement.querySelector('.popup__type').textContent = localizeType(card.offer.type);
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

    var featureList = cardElement.querySelector('.popup__features');
    var features = card.offer.features;
    window.utils.removeChildren(featureList);
    for (var i = 0; i < features.length; i++) {
      var newFeature = document.createElement('li');
      newFeature.classList.add('popup__feature');
      newFeature.classList.add('popup__feature--' + features[i]);
      featureList.appendChild(newFeature);
    }
    cardElement.querySelector('.popup__description').textContent = card.offer.description;

    var photoBlock = cardElement.querySelector('.popup__photos');
    var defaultPhoto = cardElement.querySelector('.popup__photo');
    photoBlock.removeChild(defaultPhoto);
    for (var j = 0; j < card.offer.photos.length; j++) {
      var newPhoto = defaultPhoto.cloneNode(defaultPhoto);
      newPhoto.src = card.offer.photos[j];
      photoBlock.appendChild(newPhoto);
    }

    var buttonClose = cardElement.querySelector('.popup__close');
    buttonClose.addEventListener('click', closeCard);
    map.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.ESC_CODE) {
        closeCard();
      }
    });

    return cardElement;
  };

  // Функция для удаления объявления
  var closeCard = function () {
    var card = document.querySelector('.map__card');
    if (card) {
      card.remove();
    }
  };

  // Находим место для вставки пинов и шаблон
  var pinTemplate = document.querySelector('template')
    .content
    .querySelector('.map__pin');

  // Функция для отрисовки пина
  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinAvatar = pinElement.querySelector('img');
    pinElement.style = 'left: ' + (pin.location.x - window.data.PIN_WIDTH / 2) + 'px; top: ' + (pin.location.y - window.data.PIN_HEIGHT) + 'px;';
    pinAvatar.src = pin.author.avatar;
    pinAvatar.alt = pin.offer.title;
    pinElement.addEventListener('click', function () {
      closeCard();
      map.insertBefore(renderCard(pin), cardPlace);
    });
    return pinElement;
  };

  // Создаем фрагмент, добавляем в него пины
  window.pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < adList.length; i++) {
    var pin = renderPin(adList[i]);
    window.pinsFragment.appendChild(pin);
  }
})();
