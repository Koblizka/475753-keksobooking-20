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
  types: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
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
    minX: 20,
    maxX: 740,
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
  'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована',
  'Если хочешь страдать, то ты пришёл по адресу. Ну как, хотите стать королем или королевой? Звоните!!!',
  'Можем Мы приглашаем вас окунуться в сказочный мир в прямом смысле этого слова!»',
  'Не „Баунти“, но тоже „райское наслаждение“…',
  'Здание было построено в 1895 году известным архитектором для своей семьи, что объясняет качество строения. Дом расположен у холма Петржин, на берегу Влтавы, в районе Мала Страна. Петржин, без сомнения, лучшее место для тех, кто хотел бы находиться в самом центре города и наслаждаться прогулками по красивому парку.',
  'За домом находится средневековая оборонительная стена Праги «Стена голода». О истории возникновения стены известно то, что Карл IV в 1361 году, во времена засухи и неурожая, повысил цены на хлеб. ',
  'Позже, на месте танка построили фонтан, однако его маленький кусочек до сих пор находится на площади и напоминает горожанам о действиях прошлых лет в Праге',
  'Our holiday was wonderful. Everything needed was in the apartment. A lot of dishes, tea, coffee, sugar, salt, coffee maker. Perfect cleaning. Windows overlook the courtyard, quiet at night. Thanks you.!',
];


// Возвращает массив аватарок пользователя
var getAvatarAddresses = function () {
  var addresses = [];

  for (var i = 1; i <= OFFERS_COUNT; i += 1) {
    addresses.push('img/avatars/user' + i.toString().padStart(2, '0') + '.png');
  }

  return addresses;
};

// Получаем массив адрессов аватарок
var avatarAddress = getAvatarAddresses();

// Возвращает псевдорандомное чилсо в заданном диапозоне
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Возвращает рандомное значение
var getRandomElement = function (array) {
  return array[getRandomNumber(0, array.length)];
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
      title: shuffle(OFFER_TITLES).shift(),
      address: locationX + ', ' + locationY,
      price: getRandomNumber(OFFER.prices.min, OFFER.prices.max),
      type: getRandomElement(OFFER.types),
      rooms: getRandomElement(OFFER.rooms),
      guests: getRandomElement(OFFER.guests),
      checkin: getRandomElement(OFFER.times),
      checkout: getRandomElement(OFFER.times),
      features: shuffle(OFFER.features).slice(0, getRandomNumber(1, OFFER.features.length)),
      description: shuffle(OFFER_DESCRIPTIONS),
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

  for (var i = 1; i <= OFFERS_COUNT; i += 1) {
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
var mapPins = document.querySelector('.map__pins');
// Получаем ссылку на один pin
var pin = pinTemplate.content.querySelector('.map__pin');
// Получаем ссылку на аватарку в пине
var pinImg = pin.querySelector('img');

// Убираем затемнение с карты
map.classList.remove('map--faded');

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

  for (var i = 0; i < pinSetups.length; i += 1) {
    var tempPin = preparePin(pinSetups[i]).cloneNode(true);
    fragmentPin.appendChild(tempPin);
  }

  mapPins.appendChild(fragmentPin);
};

// Вызываем рендер пинов
renderPins(offers);

var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var houseTypes = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};


var card = {
  title: cardTemplate.querySelector('.popup__title'),
  address: cardTemplate.querySelector('.popup__text--address'),
  price: cardTemplate.querySelector('.popup__text--price'),
  type: cardTemplate.querySelector('.popup__type'),
  capacity: cardTemplate.querySelector('.popup__text--capacity'),
  time: cardTemplate.querySelector('.popup__text--time'),
  features: cardTemplate.querySelector('.popup__features'),
  description: cardTemplate.querySelector('.popup__description'),
  photos: cardTemplate.querySelector('.popup__photos'),
  avatar: cardTemplate.querySelector('.popup__avatar')
};

var getFeatures = function (featureTypes) {
  var tempList = card.features.cloneNode(false);
  var tempFeature = card.features.querySelector('.popup__feature--' + featureTypes);

  tempFeature.textContent = featureTypes;
  tempList.append(tempFeature);

  return tempList;
};

var getPhotos = function (photosData) {
  var tempElement = card.photos.cloneNode(false);
  var tempPhoto = card.photos.querySelector('.popup__photo');

  for (var i = 0; i < photosData.length; i += 1) {
    tempPhoto.setAttribute('src', photosData);
    tempElement.append(tempPhoto);
  }

  return tempElement;
};

var prepareCard = function (cardData) {
  card.title.textContent = cardData.offer.title;
  card.address.textContent = cardData.offer.address;
  card.price.textContent = cardData.offer.price + '₽/ночь';
  card.type.textContent = houseTypes[cardData.offer.type];
  card.capacity.textContent = cardData.offer.rooms + ' комнаты для ' + cardData.offer.guests + ' гостей';
  card.time.textContent = 'Заезд после ' + cardData.offer.checkin + ', выезд до ' + cardData.offer.checkout;
  card.features.replaceWith(getFeatures(cardData.offer.features));
  card.description.textContent = cardData.offer.description;
  card.photos.replaceWith(getPhotos(cardData.offer.photos));
  card.avatar.setAttribute('src', cardData.authors.avatar);

  return card;
};

var renderCard = function () {
  prepareCard(offers[0]);

  var fragment = document.createDocumentFragment();

  fragment.appendChild(cardTemplate);

  document.querySelector('.map__filters-container').before(fragment);
};

renderCard();
