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
    min: 130,
    max: 630
  }
};

// Возвращает путь до аватара пользователя
var getAvatarAddress = function (number) {
  return 'img/avatars/user' + (number < 10 ? '0' + number : number) + '.png';
};

// Возвращает число в заданном диапозоне
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Возвращает рандомное значение
var getRandomElement = function (object) {
  return object[getRandomNumber(0, object.length - 1)];
};

// Перемешивание Фишера-Йетса
var shuffleFisherYets = function (array) {
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
var makeOffer = function (offerData, index) {
  var locationX = getRandomNumber(0, document.querySelector('.map').offsetWidth);
  var locationY = getRandomNumber(OFFER.map.min, OFFER.map.max);

  return {
    authors: {
      avatar: getAvatarAddress(index)
    },
    offer: {
      title: 'Offer title - ' + index,
      address: locationX + ', ' + locationY,
      price: getRandomNumber(offerData.prices.min, offerData.prices.max),
      type: getRandomElement(offerData.types),
      rooms: getRandomElement(offerData.rooms),
      guests: getRandomElement(offerData.guests),
      checkin: getRandomElement(offerData.times),
      checkout: getRandomElement(offerData.times),
      features: getRandomElement(offerData.features),
      description: 'Randome Lorem - ' + index,
      photos: getRandomElement(offerData.photos)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

//  Генерирует список предложений
var generateOffers = function (number, data) {
  var offers = [];

  for (var i = 1; i <= number; i += 1) {
    offers.push(makeOffer(data, i));
  }

  return offers;
};

// Получаем список предложений
var offers = generateOffers(OFFERS_COUNT, OFFER);

// Перемещиваем массив предложений
shuffleFisherYets(offers);

// Убираем затемнение с карты
document.querySelector('.map').classList.remove('map--faded');

// Подготавливаем шаблон пина
var preparePin = function (pinData) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinImg = pinTemplate.querySelector('img');

  pinTemplate.setAttribute('style', 'left: ' + (pinData.location.x - PIN_OFFSET.x) + 'px; ' +
  'top: ' + (pinData.location.y - PIN_OFFSET.y) + 'px;');
  pinImg.setAttribute('src', pinData.authors.avatar);
  pinImg.setAttribute('alt', pinData.offer.title);

  return pinTemplate;
};

// Рендер елемента на странице
var render = function (items, targetElement, templateFunction) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < items.length; i += 1) {
    var item = templateFunction(items[i]).cloneNode(true);
    fragment.appendChild(item);
  }

  document.querySelector(targetElement).appendChild(fragment);
};

// Вызываем рендер пинов
render(offers, '.map__pins', preparePin);

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
