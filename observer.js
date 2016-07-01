
var Observer = {};

Observer.create = function(options) {

	var observer = {};
	
	//Public variables
	observer.x = 0;
	observer.y = 0;
	observer.angle = 0;
	observer.velocity = 0;
	observer.length_contraction_factor = 1;
	observer.length_contraction_x = 1;
	observer.length_contraction_y = 1;
	
	observer.warp_enabled = true;
	
	observer.draw = function(offsetX, offsetY, contrX, contrY, zoom, sizeModifier) {
		sizeModifier = sizeModifier || 1;
	
		ctx.fillStyle="blue";
		ctx.beginPath();
		ctx.arc(offsetX + observer.x*contrX/zoom, offsetY + observer.y*contrY/zoom, 5 / zoom * sizeModifier, 0, Math.PI*2, true);
		ctx.fill();
		ctx.fillStyle="blue";
		ctx.beginPath();
		ctx.arc(offsetX + observer.x*contrX/zoom + Math.sin(observer.angle)*5/zoom*contrX*sizeModifier, offsetY + observer.y*contrY/zoom - Math.cos(observer.angle)*5/zoom*contrY*sizeModifier, 3 / zoom * sizeModifier, 0, Math.PI*2, true);
		ctx.arc(offsetX + observer.x*contrX/zoom + Math.sin(observer.angle)*8/zoom*contrX*sizeModifier, offsetY + observer.y*contrY/zoom - Math.cos(observer.angle)*8/zoom*contrY*sizeModifier, 3 / zoom * sizeModifier, 0, Math.PI*2, true);
		ctx.arc(offsetX + observer.x*contrX/zoom + Math.sin(observer.angle)*11/zoom*contrX*sizeModifier, offsetY + observer.y*contrY/zoom - Math.cos(observer.angle)*11/zoom*contrY*sizeModifier, 3 / zoom * sizeModifier, 0, Math.PI*2, true);
		ctx.fill();
	};
	
	observer.increaseThrust = function() {
		if(observer.velocity > 0.99*C && (!observer.warp_enabled || observer.velocity < C)) {
			var vBefore = observer.velocity;
			observer.velocity += 0.1 * (C - observer.velocity);
			if(vBefore == observer.velocity && observer.warp_enabled) {
				observer.velocity = C;
			}
			if(observer.velocity > SUB_LIGHT_SPEED_LIMIT) {
				observer.velocity = SUB_LIGHT_SPEED_LIMIT;
			}
		}
		else {
			observer.velocity += Math.max(0.1 * observer.velocity, 10);
		}
		observer.updateRelativisticEffects();
	};
	
	observer.decreaseThrust = function() {
		if(observer.velocity > 0.99*C && observer.velocity < C) {
			observer.velocity -= 0.1 * (C - observer.velocity);
		}
		else {
			observer.velocity -= Math.max(0.1 * observer.velocity, 100);
		}
		
		if(observer.velocity < 0) {
			observer.velocity = 0;
		}
		
		observer.updateRelativisticEffects();
	};
	
	observer.warp = function() {
		if(observer.velocity == 0) {
			observer.velocity = C - 0.000000001;
		}
		else {
			observer.velocity = 0;
		}
		observer.updateRelativisticEffects();
	};
	
	observer.turn = function(delta) {
		observer.angle += delta;
		observer.updateRelativisticEffects();
	};
	
	observer.updateRelativisticEffects = function() {
		if(observer.velocity < C) {
			observer.length_contraction_factor = Math.sqrt(1 - (observer.velocity * observer.velocity) / (C * C));
			observer.length_contraction_x = 1 - Math.abs(Math.sin(App.observer.angle) * (1 - observer.length_contraction_factor));
			observer.length_contraction_y = 1 - Math.abs(Math.cos(App.observer.angle) * (1 - observer.length_contraction_factor));
		}
	};
	
	observer.doPhysics = function() {
		observer.x += Math.sin(observer.angle) * observer.velocity / observer.length_contraction_factor / 60; //60 fps
		observer.y -= Math.cos(observer.angle) * observer.velocity / observer.length_contraction_factor / 60;
	};
	
	return observer;
};