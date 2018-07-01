'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
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
    cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
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

  // Функция для закрытия карточки объявления
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
    pinElement.style = 'left: ' + (pin.location.x - PIN_WIDTH / 2) + 'px; top: ' + (pin.location.y - PIN_HEIGHT) + 'px;';
    pinAvatar.src = pin.author.avatar;
    pinAvatar.alt = pin.offer.title;
    pinElement.addEventListener('click', function () {
      closeCard();
      map.insertBefore(renderCard(pin), cardPlace);
    });
    return pinElement;
  };
  window.render = function (pins) {
    var PIN_NUMBER = 5;
    var takeNumber = pins.length > PIN_NUMBER ? PIN_NUMBER : pins.length;
    var pinsFragment = document.createDocumentFragment();
    for (var i = 0; i < takeNumber; i++) {
      var pin = renderPin(pins[i]);
      pinsFragment.appendChild(pin);
    }
    var pinsPlace = document.querySelector('.map__pins');
    pinsPlace.appendChild(pinsFragment);
  };
})();

