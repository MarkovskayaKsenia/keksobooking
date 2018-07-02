'use strict';

(function () {
  var pins = [];

  window.onSuccess = function (data) {
    pins = data;
    window.render(pins);
  };

  var filterForm = document.querySelector('.map__filters');
  var filterType = filterForm.querySelector('#housing-type');
  var filterPrice = filterForm.querySelector('#housing-price');
  var filterRooms = filterForm.querySelector('#housing-rooms');
  var filterGuests = filterForm.querySelector('#housing-guests');
  var filterFeatures = filterForm.querySelector('#housing-features');
  var filterFeaturesCheckboxes = filterFeatures.querySelectorAll('.map__checkbox');
  var getPriceCategory = function (val) {
    if (val >= 0 && val < 10000) {
      return 'low';
    } else if (val >= 10000 && val < 50000) {
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
      for (var i = 0; i < filterFeaturesCheckboxes.length; i++) {
        if (filterFeaturesCheckboxes[i].checked === true) {
          checked.push(filterFeaturesCheckboxes[i].value);
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
    var filteredPins = [];
    for (var i = 0; i < pins.length; i++) {
      if (getRank(pins[i]) === 0) {
        filteredPins.push(pins[i]);
      }
    }
    window.render(filteredPins);
  };

  filterType.addEventListener('change', function () {
    window.debounce(updatePins);
  });
  filterPrice.addEventListener('change', function () {
    window.debounce(updatePins);
  });
  filterRooms.addEventListener('change', function () {
    window.debounce(updatePins);
  });
  filterGuests.addEventListener('change', function () {
    window.debounce(updatePins);
  });
  filterFeatures.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('map__checkbox')) {
      window.debounce(updatePins);
    }
  });
})();
