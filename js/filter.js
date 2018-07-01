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

    // var getFeaturesRank = function () {
    //   var checkedFeatures = [];
    //   for (var i = 0; i < filterFeaturesCheckboxes.length; i++) {
    //     if (filterFeaturesCheckboxes[i].checked === true) {
    //       checkedFeatures.push(filterFeaturesCheckboxes[i].value);
    //     }
    //   }
    //   дописать проверку на наличие массива чекбоксов и pin.offer.features
    //   for (var j = 0; j < checkedFeatures.length; j++) {
    //     var checkRank = 0;
    //     if (checkedFeatures[i].indexOf(pin.offer.features) === -1) {
    //       console.log(checkedFeatures[i].indexOf(pin.offer.features))
    //       checkRank = -1;
    //     }
    //   }
    //   return checkRank < 0 ? -1 : 0;
    // };
    // rank -= getFeaturesRank();
    return rank;
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
  var clearPins = function () {
    var currentPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < currentPins.length; i++) {
      currentPins[i].remove();
    }
  };

  filterType.addEventListener('change', function () {
    updatePins();
  });

  filterPrice.addEventListener('change', function () {
    updatePins();
  });

  filterRooms.addEventListener('change', function () {
    updatePins();
  });

  filterGuests.addEventListener('change', function () {
    updatePins();
  });
  // filterFeatures.addEventListener('click', function (evt) {
  //   if (evt.target.classList.contains('map__checkbox')) {
  //     updatePins();
  //   }
  // });

})();
