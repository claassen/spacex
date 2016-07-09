SPACEX = {};

SPACEX.Assets = {};

var getAsset = (function() {
  var cache = {};
  return function(path) {
    if(cache[path]) {
      return cache[path];
    }
    else {
      var image = new Image();
      image.src = path;
      cache[path] = image;
      return image;
    }
  };
})();

SPACEX.Assets.getRandomHabitablePlanetImage = function() {
  var numImages = 10;

  return getAsset("assets/planets/realistic/habitable/" + Math.floor(randInRange(1, numImages + 1)) + ".png");
};

SPACEX.Assets.getRandomInhabitablePlanetImage = function() {
  var numImages = 14;

  return getAsset("assets/planets/realistic/uninhabitable/" + Math.floor(randInRange(1, numImages + 1)) + ".png");
};

SPACEX.Assets.getRandomGasPlanetImage = function() {
  var numImages = 5;

  return getAsset("assets/planets/realistic/gas/" + Math.floor(randInRange(1, numImages + 1)) + ".png");
};

SPACEX.Assets.getRandomPlanetImage = function(type) {
  switch(type) {
    case "habitable":
      return SPACEX.Assets.getRandomHabitablePlanetImage();
    case "uninhabitable":
      return SPACEX.Assets.getRandomInhabitablePlanetImage();
    case "gas":
      return SPACEX.Assets.getRandomGasPlanetImage();
  }
};

SPACEX.Assets.getRandomSunImage = function() {
  return getAsset("assets/suns/sun" + Math.floor(randInRange(1, 8)) + ".png");
};

SPACEX.Assets.getRandomStationImage = function() {
  return getAsset("assets/stations/" + Math.floor(randInRange(1, 9)) + ".png");
};

SPACEX.Assets.getRandomAsteroidImage = function() {
  return getAsset("assets/asteroids/large/a1000" + Math.floor(randInRange(0, 10)) + ".png");
};

SPACEX.Assets.getRandomShipImage = function(type) {
  var getShipImage = function(num) {
      return getAsset("assets/ships/" + type + "/" + num + ".png");
  };

  switch(type) {
    case "advanced":
      return getShipImage(Math.floor(randInRange(1, 14)));
    case "advanced2":
      return getShipImage(Math.floor(randInRange(1, 16)));
    case "hostile":
      return getShipImage(Math.floor(randInRange(1, 10)));
    case "explorer":
      return getShipImage(Math.floor(randInRange(1, 5)));
    case "industrial":
      return getShipImage(Math.floor(randInRange(1, 5)));
    case "industrial2":
        return getShipImage(Math.floor(randInRange(1, 5)));
    case "industrial3":
        return getShipImage(Math.floor(randInRange(1, 4)));
    case "junky":
      return getShipImage(Math.floor(randInRange(1, 14)));
    case "purple_alien":
      return getShipImage(Math.floor(randInRange(1, 5)));
    case "unique_alien":
      return getShipImage(Math.floor(randInRange(1, 7)));
  }
};
