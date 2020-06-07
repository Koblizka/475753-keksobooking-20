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

// Возвращает псевдорандомное чилсо в заданном диапозоне
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Возвращает рандомное значение
var getRandomElement = function (object) {
  return object[getRandomNumber(0, object.length)];
};

// Перемещивание Фишера-Йетса
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

// Рендер пинов на странице
var renderPins = function (pinSetup) {
  var fragmentPin = document.createDocumentFragment();

  for (var i = 0; i < pinSetup.length; i += 1) {
    var pin = preparePin(pinSetup[i]).cloneNode(true);
    fragmentPin.appendChild(pin);
  }

  document.querySelector('.map__pins').appendChild(fragmentPin);
};

// Вызываем рендер пинов
renderPins(offers);

// Кстати, для перетасовки массива можно попрактиковаться в использовании алгоритма Фишера-Йетса. Почитай теорию по нему. Он простой.
