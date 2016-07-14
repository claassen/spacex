var Geometry = {};

Geometry.distance = function(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

Geometry.getPositionAtAngle = function(cx, cy, r, a) {
	return {x: cx + r*Math.sin(a), y: cy + r*Math.cos(a)};
};

function isUndefined(x) {
	return x == undefined;
}

function interceptOnCircle(p1, p2, c, r) {
    var p3 = {x: p1.x - c.x, y: p1.y - c.y}; //shifted line points
    var p4 = {x: p2.x - c.x, y: p2.y - c.y};

    var m = (p4.y - p3.y) / (p4.x - p3.x); //slope of the line
    var b = p3.y - m * p3.x; //y-intercept of line

    var underRadical = Math.pow(r,2)*Math.pow(m,2) + Math.pow(r,2) - Math.pow(b,2); //the value under the square root sign

    if (underRadical < 0) {
        //line completely missed
        return false;
    } else {
        var t1 = (-m*b + Math.sqrt(underRadical))/(Math.pow(m,2) + 1); //one of the intercept x's
        var t2 = (-m*b - Math.sqrt(underRadical))/(Math.pow(m,2) + 1); //other intercept's x
        var i1 = {x:t1+c.x, y:m*t1+b+c.y}; //intercept point 1
        var i2 = {x:t2+c.x, y:m*t2+b+c.y}; //intercept point 2
        return [i1, i2];
    }
}

Geometry.doesLineIntersectCircle = function(ax, ay, bx, by, cx, cy, r) {
	var interceptPoints = interceptOnCircle({x: ax, y: ay}, {x: bx, y:by}, {x: cx, y: cy}, r);

	if(interceptPoints === false) {
		return false;
	}

	return true;
}

function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {
        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};


Geometry.triangleArea = function(p1, p2, p3) {
	return Math.abs((p2.x * p1.y - p1.x * p2.y) + (p3.x * p2.x - p2.x * p3.x) + (p1.x * p3.y - p3.x * p1.y)) / 2;
};

Geometry.isCollision = function(gameObject, p) {
	var distance = Geometry.distance(gameObject.x, gameObject.y, p.x, p.y);

	return distance <= gameObject.r;
};

Geometry.isInActivationZone = function(gameObject, p, activationZoneRadiusOffset) {
	var distance = Geometry.distance(gameObject.x, gameObject.y, p.x, p.y);

	return distance <= gameObject.r + activationZoneRadiusOffset;
};

Geometry.isRectCollision = function(rect1, rect2) {
	return doPolygonsIntersect([rect1.p1, rect1.p2, rect1.p3, rect1.p4], [rect2.p1, rect2.p2, rect2.p3, rect2.p4]);
};
