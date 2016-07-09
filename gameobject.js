
var SPACEX = SPACEX || {};

SPACEX.GameObject = function(options) {
	options = Util.extend({
		type: "object",
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		offsetX: 0,
		offsetY: 0,
		rotation: 0,
		zoom: 1,
		isFixedPosition: false,
		isClipped: false,
	}, options);

	this.type = options.type;
	this.x = options.x;
	this.y = options.y;
	this.width = options.width;
	this.height = options.height;
	this.r = options.r || this.width / 2;
	this.offsetX = options.offsetX;
	this.offsetY = options.offsetY;
	this.rotation = options.rotation;
	this.zoom = options.zoom;
	this.isFixedPosition = options.isFixedPosition;
	this.isClipped = options.isClipped;

	this.childObjects = [];

	this.mat = mat2d.create();
	this.matInv = mat2d.create();
};

SPACEX.GameObject.prototype.addChildObject = function(childObject) {
	this.childObjects.push(childObject);
};

SPACEX.GameObject.prototype.mouseDown = function (x, y) {
	this.clickState = true;
};

SPACEX.GameObject.prototype.mouseUp = function (x, y) {
	this.clickState = false;
};

SPACEX.GameObject.prototype.mouseClick = function (x, y) {
	this.unselectAll();

	this.selected = true;
	this.mouseClickImpl();

	var mouseWorldCoords = this.screenToWorldCoords(x, y);

	for(var i = 0; i < this.childObjects.length; i++) {
		var childObject = this.childObjects[i];

		if(childObject.isFixedPosition) {
			if(Geometry.isCollision(childObject, {x: x, y: y})) {
				childObject.mouseClick(x, y);
			}
		}
		else {
			if(Geometry.isCollision(childObject, mouseWorldCoords)) {
				childObject.mouseClick(x, y);
			}
		}
	}
};

SPACEX.GameObject.prototype.mouseClickImpl = function (x, y) {
};

SPACEX.GameObject.prototype.unselectAll = function() {
	this.selected = false;

	for(var i = 0; i < this.childObjects.length; i++) {
		this.childObjects[i].unselectAll();
	}
};

SPACEX.GameObject.prototype.mouseMove = function (x, y) {
	this.hover = true;

	this.mouseMoveImpl();

	var mouseWorldCoords = this.screenToWorldCoords(x, y);

	for(var i = 0; i < this.childObjects.length; i++) {
		var childObject = this.childObjects[i];
		childObject.hover = false;
		if(Geometry.isCollision(childObject, mouseWorldCoords)) {
			childObject.mouseMove(x, y);
		}
	}
};

SPACEX.GameObject.prototype.mouseMoveImpl = function (x, y) {
};

SPACEX.GameObject.prototype.mouseScroll = function(e) {
};

SPACEX.GameObject.prototype.keyPressed = function(e) {
};

SPACEX.GameObject.prototype.update = function() {
	for(var i = 0; i < this.childObjects.length; i++) {
		this.childObjects[i].update();
	}
};

SPACEX.GameObject.prototype.translate = function(deltaX, deltaY) {
	if(!this.isFixedPosition && this.type != "player") {
		this.x += deltaX;
		this.y += deltaY;
	}

	if(this.type != "player") {
		for(var i = 0; i < this.childObjects.length; i++) {
			this.childObjects[i].translate(deltaX, deltaY);
		}
	}
};

SPACEX.GameObject.prototype.screenToWorldCoords = function(x, y) {
	return {
		x: x * this.matInv[0] + y * this.matInv[2] + this.matInv[4],
		y: x * this.matInv[1] + y * this.matInv[3] + this.matInv[5]
	};
};

SPACEX.GameObject.prototype.worldToScreenCoords = function(x, y) {
	return {
		x: x * this.mat[0] + y * this.mat[2] + this.mat[4],
		y: x * this.mat[1] + y * this.mat[3] + this.mat[5]
	};
};

SPACEX.GameObject.prototype.getWorldBoundingRectangle = function() {
	if(this.isFixedPosition) {
		return {
			p1: this.screenToWorldCoords(this.x, this.y),
			p2: this.screenToWorldCoords(this.x + this.width, this.y),
			p3: this.screenToWorldCoords(this.x + this.width, this.y + this.height),
			p4: this.screenToWorldCoords(this.x, this.y + this.height)
		};
	}
	else {
		return {
			p1: { x: this.x, y: this.y },
			p2: { x: this.x + this.width, y: this.y },
			p3: { x: this.x + this.width, y: this.y + this.height},
			p4: { x: this.x, y: this.y + this.height }
		};
	}
};

SPACEX.GameObject.prototype.draw = function(mat) {
	ctx.save();

	if(this.isFixedPosition) {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
	}

	this.drawImpl();

	if(this.isClipped) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.closePath();
		ctx.clip();
	}

	if(this.isFixedPosition) {
		this.mat = mat2d.create();
	}
	else {
		this.mat = mat || mat2d.create();
	}

	if(this.isFixedPosition) {
		ctx.translate(this.x, this.y);
		mat2d.translate(this.mat, this.mat, [this.x, this.y]);
	}

	ctx.translate(this.width / 2, this.height / 2);
	mat2d.translate(this.mat, this.mat, [this.width / 2, this.height / 2]);

	ctx.rotate(this.rotation);
	mat2d.rotate(this.mat, this.mat, this.rotation);

	ctx.translate(-(this.width / 2), -(this.height / 2));
	mat2d.translate(this.mat, this.mat, [-(this.width / 2), -(this.height / 2)]);

	ctx.scale(this.zoom, this.zoom);
	mat2d.scale(this.mat, this.mat, [this.zoom, this.zoom]);

	ctx.translate(this.offsetX, this.offsetY);
	mat2d.translate(this.mat, this.mat, [this.offsetX, this.offsetY]);

	mat2d.invert(this.matInv, this.mat);

	var worldBoundingRectangle = this.getWorldBoundingRectangle();

	for(var i = 0; i < this.childObjects.length; i++) {
		var childObject = this.childObjects[i];

		if(!this.isClipped || childObject.isFixedPosition) {
			childObject.draw(this.mat);
		}
		else {
			if(Geometry.isRectCollision(worldBoundingRectangle, childObject.getWorldBoundingRectangle())) {
				childObject.draw(this.mat);
			}
		}
	}

	ctx.restore();
};

SPACEX.GameObject.prototype.takeDamage = function(damage) {

};
