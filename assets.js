SPACEX = {};

SPACEX.Assets = {};

SPACEX.Assets.getRandomHabitablePlanetImage = function() {
  var numImages = 10;

  var image = new Image();
  image.src = "assets/planets/realistic/habitable/" + Math.floor(randInRange(1, numImages + 1)) + ".png";
  return image;
};

SPACEX.Assets.getRandomInhabitablePlanetImage = function() {
  var numImages = 14;

  var image = new Image();
  image.src = "assets/planets/realistic/uninhabitable/" + Math.floor(randInRange(1, numImages + 1)) + ".png";
  return image;
};

SPACEX.Assets.getRandomGasPlanetImage = function() {
  var numImages = 5;

  var image = new Image();
  image.src = "assets/planets/realistic/gas/" + Math.floor(randInRange(1, numImages + 1)) + ".png";
  return image;
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
  var image = new Image();
  image.src = "assets/suns/sun" + Math.floor(randInRange(1, 8)) + ".png";
  return image;
};
