'use strict';

(function () {
  var priceRank = {
    MIN: 0,
    LOW: 10000,
    MIDDLE: 50000
  };
  var pins = [];

  window.onSuccess = function (data) {
    pins = data;
    window.render(pins);
  };

  var filterForm = document.querySelector('.map__filters');
  var filters = filterForm.querySelectorAll('.map__filter');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelector('#housing-features');
  var checkboxes = filterFeatures.querySelectorAll('.map__checkbox');

  var getPriceCategory = function (val) {
    if (val >= priceRank.MIN && val < priceRank.LOW) {
      return 'low';
    } else if (val >= priceRank.LOW && val < priceRank.MIDDLE) {
      return 'middle';
    }
    return 'high';
  };

  var getRank = function (pin) {
    var rank = 0;
    if (filterType.value !== pin.offer.type && filterType.value !== 'any') {
      rank -= 1;
    }
    if (filterPrice.value !== getPriceCategory(pin.offer.price) && filterPrice.value !== 'any') {
      rank -= 1;
    }
    if (filterRooms.value !== pin.offer.rooms.toString() && filterRooms.value !== 'any') {
      rank -= 1;
    }
    if (filterGuests.value !== pin.offer.guests.toString() && filterGuests.value !== 'any') {
      rank -= 1;
    }
    var getCheckedFeatures = function () {
      var checked = [];
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
          checked.push(checkboxes[i].value);
        }
      }
      return checked;
    };
    var checkedFeatures = getCheckedFeatures();
    var getFeaturesRank = function (checked, features) {
      var checkRank = 0;
      for (var i = 0; i < checked.length; i++) {
        if (features.indexOf(checked[i]) === -1) {
          checkRank -= 1;
        }
      }
      return checkRank < 0 ? -1 : 0;
    };
    rank += getFeaturesRank(checkedFeatures, pin.offer.features);
    return rank;
  };
  var clearPins = function () {
    var currentPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < currentPins.length; i++) {
      currentPins[i].remove();
    }
  };
  var updatePins = function () {
    clearPins();
    var filteredPins = pins.filter(function (elem) {
      return getRank(elem) === 0;
    });
    window.render(filteredPins);
  };

  filters.forEach(function (elem) {
    elem.addEventListener('change', function () {
      window.debounce(updatePins);
    });
  });

  checkboxes.forEach(function (elem) {
    elem.addEventListener('click', function () {
      window.debounce(updatePins);
    });
  });
})();
