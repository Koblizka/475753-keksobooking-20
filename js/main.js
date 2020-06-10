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
// Получаем ссылку на pin
var pin = document.querySelector('#pin');
// Получаем ссылку на блок пинов на карте
var mapPins = document.querySelector('.map__pins');

// Убираем затемнение с карты
map.classList.remove('map--faded');

// Подготавливаем шаблон пина
var makePin = function (pinData) {
  var pinTemplate = pin.content.querySelector('.map__pin');
  var pinImg = pinTemplate.querySelector('img');

  pinTemplate.setAttribute('style', 'left: ' + (pinData.location.x - PIN_OFFSET.x) + 'px; ' +
  'top: ' + (pinData.location.y - PIN_OFFSET.y) + 'px;');
  pinImg.setAttribute('src', pinData.authors.avatar);
  pinImg.setAttribute('alt', pinData.offer.title);

  return pinTemplate;
};

// Рендер пинов на странице
var renderPins = function (pinSetups) {
  var fragmentPin = document.createDocumentFragment();

  for (var i = 0; i < pinSetups.length; i += 1) {
    var tempPin = makePin(pinSetups[i]).cloneNode(true);
    fragmentPin.appendChild(tempPin);
  }

  mapPins.appendChild(fragmentPin);
};

// Вызываем рендер пинов
renderPins(offers);

// Кстати, для перетасовки массива можно попрактиковаться в использовании алгоритма Фишера-Йетса. Почитай теорию по нему. Он простой.
