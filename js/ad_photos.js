'use strict';
(function () {

  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var housePhotoContainer = document.querySelector('.ad-form__photo-container');
  var houseFileChooser = housePhotoContainer.querySelector('.ad-form__upload input[type=file]');
  var housePreview = housePhotoContainer.querySelector('.ad-form__photo');

  var matches = function (str) {
    var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
    return FILE_TYPES.some(function (it) {
      return str.endsWith(it);
    });
  };


  avatarFileChooser.addEventListener('change', function () {
    var file = avatarFileChooser.files[0];
    var fileName = file.name.toLowerCase();

    if (matches(fileName)) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  var photoLoader = function (str) {
    var img = new Image(70, 70);
    str.addEventListener('load', function () {
      img.src = this.result;
    });
    return img;
  };


  houseFileChooser.addEventListener('change', function () {
    var fragmentPhotos = document.createDocumentFragment();
    var fileMass = houseFileChooser.files;
    var count = 0;

    for (var i = 0; i < fileMass.length; i++) {
      var fileName = fileMass[i].name.toLowerCase();
      if (matches(fileName)) {
        var reader = new FileReader();
        reader.readAsDataURL(fileMass[i]);
        var photoItem = photoLoader(reader);
        photoItem.title = 'Фото № ' + (++count);
        var previewItem = housePreview.cloneNode(true);
        previewItem.appendChild(photoItem);
        fragmentPhotos.appendChild(previewItem);
      }
    }
    housePhotoContainer.removeChild(housePreview);
    housePhotoContainer.appendChild(fragmentPhotos);
  });
})();
