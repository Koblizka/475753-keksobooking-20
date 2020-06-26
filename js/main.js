'use strict';

//  Количество предложений
var OFFERS_COUNT = 8;
// Смещение пина
var PIN_OFFSET = {
  x: 25,
  y: 70
};
// Константы предложений
var OFFER = {
  prices: {
    min: 1000,
    max: 5000
  },
  rooms: [
    1,
    2,
    3,
    100
  ],
  guests: [
    1,
    2,
    3
  ],
  times: [
    '12:00',
    '13:00',
    '14:00'
  ],
  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  map: {
    minX: 0,
    maxX: 1200,
    minY: 130,
    maxY: 630
  }
};

var OFFER_TITLES = [
  'Вот это самый чёткий вариант',
  'Если хочешь страдать, то ты пришёл по адресу',
  'Можем вместе потусить — пива воспить',
  'Чётче моей хатки, только бобровая хатка',
  'Не забывай оглядываться когда чистишь зубы',
  'Воздух платный, холодильник тоже',
  'Пшек пржек, ПШЕК вржек',
  'Мир, дверь, мяч!',
];
var OFFER_DESCRIPTIONS = [
  'Великолепная квартира-студия в центре Токио.',
  'Если хочешь страдать, то ты пришёл по адресу.',
  'Мы приглашаем вас окунуться в сказочный мир в прямом смысле этого слова!»',
  'Не „Баунти“, но тоже „райское наслаждение“.',
  'Здание было построено в 1895 году известным архитектором для своей семьи, что объясняет качество строения.',
  'За домом находится средневековая оборонительная стена Праги «Стена голода».',
  'Позже, на месте танка построили фонтан, однако его маленький кусочек до сих пор находится на площади и напоминает горожанам о действиях прошлых лет в Праге',
  'Our holiday was wonderful. Everything needed was in the apartment.',
];
var HouseType = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

// Возвращает массив аватарок пользователя
var getAvatarAddresses = function () {
  var addresses = [];

  for (var i = 1; i <= OFFERS_COUNT; i++) {
    addresses.push('img/avatars/user' + i.toString().padStart(2, '0') + '.png');
  }

  return addresses;
};

// Получаем массив адрессов аватарок
var avatarAddress = getAvatarAddresses();

// Возвращает псевдорандомное чилсо в заданном диапозоне
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Возвращает одно рандомное значение
var getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length - 1)];
};

// Возвращает пару описание в пару предложений
var getDescription = function () {
  var preparedSentences = shuffle(OFFER_DESCRIPTIONS).slice(0, 2);

  return preparedSentences[0] + ' ' + preparedSentences[1];
};

// Перемещивание Фишера-Йетса
var shuffle = function (array) {
  var j = 0;
  var temp = 0;

  for (var i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }

  return array;
};

// Подготавливает предложение
var makeOffer = function () {
  var locationX = getRandomNumber(OFFER.map.minX, OFFER.map.maxX);
  var locationY = getRandomNumber(OFFER.map.minY, OFFER.map.maxY);

  return {
    authors: {
      avatar: avatarAddress.shift()
    },
    offer: {
      title: getRandomElement(shuffle(OFFER_TITLES)),
      address: locationX + ', ' + locationY,
      price: getRandomNumber(OFFER.prices.min, OFFER.prices.max),
      type: getRandomElement(Object.keys(HouseType)),
      rooms: getRandomElement(OFFER.rooms),
      guests: getRandomElement(OFFER.guests),
      checkin: getRandomElement(OFFER.times),
      checkout: getRandomElement(OFFER.times),
      features: shuffle(OFFER.features).slice(0, getRandomNumber(1, OFFER.features.length)),
      description: getDescription(),
      photos: shuffle(OFFER.photos).slice(0, getRandomNumber(1, OFFER.photos.length)),
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

//  Генерирует список предложений
var generateOffers = function () {
  var offers = [];

  for (var i = 1; i <= OFFERS_COUNT; i++) {
    offers.push(makeOffer());
  }

  return offers;
};

// Получаем список предложений
var offers = generateOffers();

// Перемещиваем массив предложений
shuffle(offers);

// Получаем ссылку на карту
var map = document.querySelector('.map');
// Получаем ссылку на шаблон pin
var pinTemplate = document.querySelector('#pin');
// Получаем ссылку на блок пинов на карте
var mapPins = map.querySelector('.map__pins');
// Получаем ссылку на один pin
var pin = pinTemplate.content.querySelector('.map__pin');
// Получаем ссылку на аватарку в пине
var pinImg = pin.querySelector('img');

// Подготавливаем шаблон пина
var preparePin = function (pinData) {
  pin.style.left = pinData.location.x - PIN_OFFSET.x + 'px';
  pin.style.top = pinData.location.y - PIN_OFFSET.y + 'px';
  pinImg.src = pinData.authors.avatar;
  pinImg.alt = pinData.offer.title;

  return pin;
};

// Рендер пинов на странице
var renderPins = function (pinSetups) {
  var fragmentPin = document.createDocumentFragment();

  for (var i = 0; i < pinSetups.length; i++) {
    var tempPin = preparePin(pinSetups[i]).cloneNode(true);
    fragmentPin.appendChild(tempPin);

    var onClick = onClickPin(pinSetups[i]);
    tempPin.addEventListener('click', onClick);
  }

  mapPins.appendChild(fragmentPin);
};
// /*
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var getFeatures = function (features) {
  var featureList = cardTemplate.querySelector('.popup__features');

  featureList.innerHTML = '';

  for (var i = 0; i < features.length; i++) {
    var featureItem = document.createElement('li');

    featureItem.classList.add('popup__feature', 'popup__feature--' + features[i]);
    featureList.appendChild(featureItem);
  }

  return featureList;
};

var getPhotos = function (photos) {
  var photosList = cardTemplate.querySelector('.popup__photos');

  photosList.innerHTML = '';

  for (var i = 0; i < photos.length; i++) {
    var photosItem = document.createElement('img');

    photosItem.classList.add('popup__photo');
    photosItem.src = photos[i];
    photosItem.style.width = 45 + 'px';
    photosItem.style.height = 40 + 'px';
    photosItem.style.alt = 'Фотография жилья';
    photosList.appendChild(photosItem);
  }

  return photosList;
};

var prepareCard = function (cardData) {
  cardTemplate.querySelector('.popup__title').textContent = cardData.offer.title;
  cardTemplate.querySelector('.popup__text--address').textContent = cardData.offer.address;
  cardTemplate.querySelector('.popup__text--price').textContent = cardData.offer.price + '₽/ночь';
  cardTemplate.querySelector('.popup__type').textContent = HouseType[cardData.offer.type];
  cardTemplate.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms + ' комнаты для ' + cardData.offer.guests + ' гостей';
  cardTemplate.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout;
  cardTemplate.querySelector('.popup__description').textContent = cardData.offer.description;
  cardTemplate.querySelector('.popup__avatar').src = cardData.authors.avatar;

  getFeatures(cardData.offer.features);
  getPhotos(cardData.offer.photos);

  cardTemplate.querySelector('.popup__close').addEventListener('mousedown', closeCard);

  return cardTemplate;
};

var renderCard = function (offerItem) {
  prepareCard(offerItem);

  var fragment = document.createDocumentFragment();

  fragment.appendChild(cardTemplate);

  document.querySelector('.map__filters-container').before(fragment);
};

// Вызываем рендер карточки
// renderCard(offers[0]);
// */

var mapFilters = map.querySelectorAll('.map__filter');
var mapFeatures = map.querySelector('.map__features');
var adForm = document.querySelector('.notice').querySelector('.ad-form');
var adFormElements = adForm.children;
var pinMain = mapPins.querySelector('.map__pin--main');

var disableInputs = function (isDisabled) {
  for (var i = 0; i < mapFilters.length; i++) {
    mapFilters[i].disabled = isDisabled;
  }

  for (i = 0; i < adFormElements.length; i++) {
    adFormElements[i].disabled = isDisabled;
  }

  mapFeatures.disabled = isDisabled;
};

// Отключаем формы на странице
disableInputs(true);

var setAddress = function (isApproximate) {
  var pinMainCenterX = (pinMain.offsetLeft + Math.floor(pinMain.offsetWidth / 2));
  var pinMainCenterY = (pinMain.offsetTop + Math.floor(pinMain.offsetHeight / 2));
  var pinMainOffsetCenterY = pinMain.offsetTop + pinMain.offsetHeight + 18;
  var address = (isApproximate) ? (pinMainCenterX + ', ' + pinMainCenterY) : (pinMainCenterX + ', ' + pinMainOffsetCenterY);

  adForm.querySelector('#address').value = address;
};

// Задаёмд приблизительный адрес
setAddress(true);

// Активируем страницу
var activatePage = function () {
  // Убираем затемнение с карты
  map.classList.remove('map--faded');
  // Убираем дизейбл с формы
  adForm.classList.remove('ad-form--disabled');
  disableInputs(false);
  // Вызываем рендер пинов
  renderPins(offers);
  // Задаём точный адрес
  setAddress(false);
};

var onMousedownPinMain = function (evt) {
  if (evt.button === 0) {
    activatePage();
  }

  pinMain.removeEventListener('mousedwon', onMousedownPinMain);
};

var onKeydownMainPin = function (evt) {
  if (evt.key === 'Enter') {
    activatePage();
  }

  pinMain.removeEventListener('keydownn', onKeydownMainPin);
};

pinMain.addEventListener('mousedown', onMousedownPinMain);
pinMain.addEventListener('keydown', onKeydownMainPin);

var roomNumber = adForm.querySelector('#room_number');
var capacities = adForm.querySelector('#capacity');
var RoomCapacities = {
  1: [1],
  2: [2, 1],
  3: [3, 2, 1],
  100: [0]
};

var validateGuests = function () {
  capacities.querySelectorAll('option').forEach(function (guest) {
    guest.disabled = true;
  });

  roomNumber.querySelectorAll('option').forEach(function (room) {
    if (room.selected === true) {
      var scopedRoom = RoomCapacities[room.value];

      capacities.querySelector('[value="' + scopedRoom[0] + '"]').selected = true;
      scopedRoom.forEach(function (scope) {
        capacities.querySelector('[value="' + scope + '"]').disabled = false;
      });
    }
  });

  // roomNumbers.removeEventListener('change', validateGuests);
};

validateGuests();

roomNumber.addEventListener('change', validateGuests);


// Устанавливаем соответствие типа дома и цены
var house = adForm.querySelector('#type');
var priceForNight = adForm.querySelector('#price');
var StartHousePrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var onChangeHouse = function (evt) {
  priceForNight.placeholder = StartHousePrice[evt.target.value];
  priceForNight.min = StartHousePrice[evt.target.value];

  // house.removeEventListener('change', onChangeHouse);
};

house.addEventListener('change', onChangeHouse);

// Синхронизируем время заезда
var timeGroup = adForm.querySelector('.ad-form__element--time');
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');

var onChangeTimeIn = function (evt) {
  var targetTime = evt.target.value;

  timeIn.value = targetTime;
  timeOut.value = targetTime;

  // timeGroup.removeEventListener('change', onChangeTimeIn);
};

timeGroup.addEventListener('change', onChangeTimeIn);

// Выводим карточки по клику
var onClickPin = function (offerItem) {
  return function () {
    renderCard(offerItem);
    document.addEventListener('keydown', closeCard);
  };
};

var closeCard = function (evt) {
  if (evt.key === 'Escape' || evt.button === 0) {
    document.querySelector('.popup').remove();
    document.removeEventListener('mousedown', closeCard);
    document.removeEventListener('keydown', closeCard);
  }
};
