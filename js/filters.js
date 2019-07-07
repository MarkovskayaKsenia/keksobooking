'use strict';
(function () {

  var MAX_PINS = 5;
  var MAX_PRICE = 50000;
  var MIN_PRICE = 10000;
  var pins=[];

  window.onSuccess = function(data) {
    pins = data;
    window.insertPins(data)
  }

  // Функция удаления пинов
  var removePins = function () {
    var currentPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < currentPins.length; i++) {
      currentPins[i].remove();
    }
  };

  var mapFilters = document.querySelector('.map__filters');
  var housingTypeSelect = mapFilters.querySelector('#housing-type');
  var housingPriceSelect = mapFilters.querySelector('#housing-price');
  var housingRoomsSelect = mapFilters.querySelector('#housing-rooms');
  var housingGuestsSelect = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelectorAll('.map__checkbox');

  var filterByType = function (elem) {
    if (housingTypeSelect.value === 'any') {
      return true;
    } else {
      return elem.offer.type === housingTypeSelect.value;
    }
  };

  var filterByPrice = function (elem) {
    switch (housingPriceSelect.value) {
      case 'low': return elem.offer.price < MIN_PRICE;
        break;
      case 'middle': return elem.offer.price >= MIN_PRICE && elem.offer.price < MAX_PRICE;
        break;
      case 'high': return elem.offer.price >= MAX_PRICE;
        break;
      default: return true;
    }
  };

  var filterByRooms = function (elem) {
    if (housingRoomsSelect.value === 'any') {
      return true;
    } else {
      return elem.offer.rooms.toString() === housingRoomsSelect.value;
    }
  };

  var filterByGuests = function (elem) {
    if (housingGuestsSelect.value === 'any') {
      return true;
    } else {
      return elem.offer.guests.toString() === housingGuestsSelect.value;
    }
  };

  var filterByFeatures = function (elem) {
    for (var i = 0; i < housingFeatures.length; i++) {
      if (housingFeatures[i].checked && elem.offer.features.indexOf(housingFeatures[i].value) === -1) {
        return false;
      }
    }
    return true;
  };
  var filterByQuantity = function(elem, index) {
    if(index < MAX_PINS) return true;
  };

  var updatePins = function() {
    removePins();
    var pinsFilter = pins
      .filter(filterByType)
      .filter(filterByRooms)
      .filter(filterByGuests)
      .filter(filterByPrice)
      .filter(filterByFeatures)
      .filter(filterByQuantity);
    window.insertPins(pinsFilter);
  };


  mapFilters.addEventListener('change',function(){
   window.debounce(updatePins());
  });
}());

