SPACEX = SPACEX || {};

SPACEX.ShipHelper = {};

SPACEX.ShipHelper.getRandomShip = function(type, faction) {
  var sizeMap = {
    "small": SMALL_SHIP_RADIUS,
    "medium": MEDIUM_SHIP_RADIUS,
    "large": LARGE_SHIP_RADIUS
  };

  var createShip = function(size, image) {
    return new SPACEX.Ship(sizeMap[size], image, { faction: faction });
  };

  var getShipImage = function(size, num) {
      return getAsset("assets/ships/" + type + "/" + "/" + size + "/" + num + ".png");
  };

  switch(type) {
    case "advanced":
      return createShip("large", getShipImage("large", Math.floor(randInRange(1, 14))));

    case "advanced2":
      return createShip("large", getShipImage("large", Math.floor(randInRange(1, 15))));

    case "hostile":
      var size = selectValueWithProbability(["small", "medium", "large"], [40, 30, 30]);
      switch(size) {
        case "small":
          return createShip("small", getShipImage("small", Math.floor(randInRange(1, 6))));
        case "medium":
          return createShip("medium", getShipImage("medium", Math.floor(randInRange(1, 3))));
        case "large":
          return createShip("large", getShipImage("large", Math.floor(randInRange(1, 3))));
      }

    case "explorer":
      return createShip("small", getShipImage("small", Math.floor(randInRange(1, 5))));

    case "industrial":
      var size = selectValueWithProbability(["medium", "large"], [50, 50]);
      switch(size) {
        case "medium":
          return createShip("medium", getShipImage("medium", Math.floor(randInRange(1, 3))));
        case "large":
          return createShip("large", getShipImage("large", Math.floor(randInRange(1, 3))));
      }

    case "industrial2":
        return createShip("medium", getShipImage("medium", Math.floor(randInRange(1, 5))));

    case "industrial3":
        return createShip("medium", getShipImage("medium", Math.floor(randInRange(1, 4))));

    case "junky":
      var size = selectValueWithProbability(["small", "medium", "large"], [10, 20, 70]);
      switch(size) {
        case "small":
          return createShip("small", getShipImage("small", Math.floor(randInRange(1, 4))));
        case "medium":
          return createShip("medium", getShipImage("medium", Math.floor(randInRange(1, 3))));
        case "large":
          return createShip("large", getShipImage("large", Math.floor(randInRange(1, 7))));
      }

    case "purple_alien":
      return createShip("small", getShipImage("small", Math.floor(randInRange(1, 5))));

    case "unique_alien":
      return createShip("large", getShipImage("large", Math.floor(randInRange(1, 7))));
  }
};
