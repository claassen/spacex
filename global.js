
var ctx = null;

var WIDTH = window.innerWidth - 20;
var HEIGHT = window.innerHeight - 20;

var C = 299800;
var SUB_LIGHT_SPEED_LIMIT = 299800;

var C_IN_KMS = 299800;

var KM_PER_LIGHTYEAR = 9461000000000;
var KM_PER_LIGHTHOUR = KM_PER_LIGHTYEAR / (365 * 24);
var KM_PER_LIGHTMINUTE = KM_PER_LIGHTYEAR / (365 * 24 * 60);
var KM_PER_LIGHTSECOND = KM_PER_LIGHTYEAR / (365 * 24 * 60 * 60);

var NUM_SYSTEMS = 500;

//var GALAXY_ARM_LENGTH = 50000000;
var GALAXY_ARM_LENGTH = 70000000;
var GALAXY_ARM_WIDTH = GALAXY_ARM_LENGTH / 3;
var GALAXY_ARM_ROTATION = Math.PI * 1.5;

// var SYSTEM_RADIUS = 100000;
// var SUN_RADIUS = 7000;
// var PLANET_RADIUS = 500;
// var GAS_GIANT_RADIUS = 1000;
// var STATION_RADIUS = 50;
//var STATION_ORBIT_DISTANCE = 100;
// var SHIP_BASE_RADIUS = 50;

var SYSTEM_RADIUS = 300000;
var SUN_RADIUS = 10000;
var PLANET_RADIUS = 1000;
var GAS_GIANT_RADIUS = 2000;
var STATION_RADIUS = 100;
var STATION_ORBIT_DISTANCE = 200;

var SMALL_SHIP_RADIUS = 50;
var MEDIUM_SHIP_RADIUS = 75;
var LARGE_SHIP_RADIUS = 200;

var MIN_NUM_PLANETS = 2;
var MAX_NUM_PLANETS = 6;

var SYSTEM_ZOOM_LIMIT = 0.05;
var MAP_ZOOM_LIMIT = 0.000125;

var INTRO_ZOOM_START = 0.000005;
var INTRO_ZOOM_END = 1;

var MIN_ZOOM_LIMIT = 0.000001;
var MAX_ZOOM_LIMIT = 2;

var PERCENT_HABITABLE_PLANETS = 100; //20;
var PERCENT_UNINHABITABLE_PLANETS = 0; //60;
var PERCENT_GAS_PLANETS = 0; //20;

var PERCENT_STATIONS = 100; //50;
var PERCENT_ASTEROID_BELTS = 50;
var NUM_ASTEROIDS = 300;
var ASTEROID_RADIUS = 200;

function clear(x, y, width, height) {
	ctx.fillStyle = "black";
	ctx.fillRect(x, y, width, height);
}

function distanceDisplayValue(distanceInKm) {
	if(distanceInKm >= KM_PER_LIGHTYEAR / 10) {
		return (distanceInKm / KM_PER_LIGHTYEAR).toFixed(2) + " light years";
	}
	else if(distanceInKm >= KM_PER_LIGHTHOUR) {
		return (distanceInKm / KM_PER_LIGHTHOUR).toFixed(2) + " light hours";
	}
	else if(distanceInKm >= KM_PER_LIGHTMINUTE) {
		return (distanceInKm / KM_PER_LIGHTMINUTE).toFixed(2) + " light minutes";
	}
	else if(distanceInKm >= KM_PER_LIGHTSECOND) {
		return (distanceInKm / KM_PER_LIGHTSECOND).toFixed(2) + " light seconds";
	}
	else if(distanceInKm >= 1000000) {
		return (distanceInKm / 1000000).toFixed(2) + " million km";
	}
	else if(distanceInKm >= 1000) {
		return (distanceInKm / 1000).toFixed(2) + " thousand km";
	}
	else {
		return distanceInKm.toFixed(2) + " km";
	}
}

function velocityDisplayValue(velocityInKmPerS) {
	if(velocityInKmPerS >= 0.1*KM_PER_LIGHTYEAR) {
		return (velocityInKmPerS / KM_PER_LIGHTYEAR).toFixed(2) + " LY/s";
	}
	else if(velocityInKmPerS >= 0.1 * C_IN_KMS) {
		if(velocityInKmPerS > 0.99 * C_IN_KMS) {
			return (velocityInKmPerS / C_IN_KMS) + "C";
		}
		else {
			return (velocityInKmPerS / C_IN_KMS).toFixed(2) + "C";
		}
	}
	else {
		return velocityInKmPerS.toFixed(2) + " km/s";
	}
}

function randInRange(min, max) {
	return Math.random() * (max - min) + min;
}

function getBiasedRandomNumber(min, max, bias, influence) {
    var rnd = Math.random() * (max - min) + min,   // random in range
        mix = Math.random() * influence;           // random mixer
    return rnd * (1 - mix) + bias * mix;           // mix full range and bias
}

function selectValueWithProbability(values, probabilities) {
	var sum = 0;
	var cumSum = [];

	for(var i = 0; i < probabilities.length; i++) {
		sum += probabilities[i];
		cumSum[i] = sum;
	}

	var rand = Math.random() * sum;

	for(var i = 0; i < probabilities.length; i++) {
		if(rand <= cumSum[i]) {
			return values[i];
		}
	}
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

//This is much better than the default arc method, but only works for drawing perfect circles
CanvasRenderingContext2D.prototype.arc = function(x, y, r /*, startAngle, endAngle, anticlockwise*/){
  m = 0.551784

  ctx.save()
  ctx.translate(x, y)
  ctx.scale(r, r)

  ctx.beginPath()
  ctx.moveTo(1, 0)
  ctx.bezierCurveTo(1,  -m,  m, -1,  0, -1)
  ctx.bezierCurveTo(-m, -1, -1, -m, -1,  0)
  ctx.bezierCurveTo(-1,  m, -m,  1,  0,  1)
  ctx.bezierCurveTo( m,  1,  1,  m,  1,  0)
  ctx.closePath()
  ctx.restore()
}
