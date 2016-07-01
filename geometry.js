var Geometry = {};

Geometry.distance = function(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};


function isUndefined(x) {
	return x == undefined;
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
                //CONSOLE("polygons don't intersect!");
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

//http://stackoverflow.com/questions/17136084/checking-if-a-point-is-inside-a-rotated-rectangle
// Geometry.isCollision = function(rect, p) {
// 	var rectWidth = Geometry.distance(
// 		rect.p1.x, rect.p1.y,
// 		rect.p2.x, rect.p2.y
// 	);
//
// 	var rectHeight = Geometry.distance(
// 		rect.p2.x, rect.p2.y,
// 		rect.p3.x, rect.p3.y
// 	);
//
// 	var rectArea = rectWidth * rectHeight;
//
// 	//Not a collision if sum of a1, a2, a3 > rectangle area
//
// 	//p1, p, p4
// 	var a1 = Geometry.triangleArea(rect.p1, p, rect.p4);
//
// 	//p4, p, p3
// 	var a2 = Geometry.triangleArea(rect.p4, p, rect.p3);
//
// 	//p3, p, p2
// 	var a3 = Geometry.triangleArea(rect.p4, p, rect.p3);
//
// 	//p, p2, p1
// 	var a4 = Geometry.triangleArea(p, rect.p2, rect.p1);
//
// 	return a1 + a2 + a3 <= rectArea;
// };

Geometry.isRectCollision = function(rect1, rect2) {
	return doPolygonsIntersect([rect1.p1, rect1.p2, rect1.p3, rect1.p4], [rect2.p1, rect2.p2, rect2.p3, rect2.p4]);
};

//
// Geometry.isCollision = function(rectMinX, rectMinY, rectMaxX, rectMaxY, xMin, yMin, xMax, yMax) {
// 	xMax = xMax || xMin;
// 	yMax = yMax || yMin;
//
// 	return xMax >= rectMinX &&
// 		   xMin <= rectMaxX &&
// 		   yMax >= rectMinY &&
// 		   yMin <= rectMaxY;
// };
