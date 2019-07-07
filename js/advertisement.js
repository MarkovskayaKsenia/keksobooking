'use strict';

(function () {
  //Находим шаблон объявления
  var adTemplate = document.querySelector('template').content.querySelector('.popup');


  // Локализация типов жилья
  var localizeTypes = function (str) {
    switch (str) {
      //case 'any': return 'Любой тип жилья';
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

  // Удобства жилья
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

  // Фотографии объявления
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
    // Функции для установки положения метки на основе координат
    getPinX: function (x, pinWidth) {
      return x - pinWidth / 2;
    },

    getPinY: function (y, pinHeight) {
      return y - pinHeight;
    },

    // Отрисовка шаблона объявления
    renderAdvertisement: function (obj) {

      var adNew = adTemplate.cloneNode(true);
      adNew.style.zIndex = '30';
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
