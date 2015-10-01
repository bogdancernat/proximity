var canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    mouse = {x: 0, y: 0},
    color = (new window.RColor()).get(false, 0.8, 0.94),
    circles = [],
    radius = 10;

canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;

canvas.addEventListener('mousemove', canvasMouseMove);
canvas.addEventListener('click', canvasOnClick);

function canvasOnClick(e) {
    var target = e.target;

    var point = {
        x: e.pageX - target.offsetLeft,
        y: e.pageY - target.offsetTop
    };

    addCircle(point);
    canvasDraw();
}

function addCircle(point) {
    var tempCircles = [];

    var dfx = window.tb.distAB({x:0, y: 0}, point);
    point.radius = radius;
    point.dfx = dfx;
    point.color = color;

    if(circles.length > 1) {
       insert(point, circles);
    } else if(circles.length == 1) {
        if(circles[0].dfx > point.dfx) {
            circles.unshift(point);
        } else {
            circles.push(point);
        }
    } else if(circles.length == 0) {
        circles.push(point);
    }
}

function insert (point, array) {
    array.splice(locationOf(point, array) + 1, 0, point);
}

function locationOf(point, array, start, end) {
    start = start || 0;
    end = end || array.length;

    var pivot = parseInt(start + (end - start) / 2, 10);
    if (array[pivot].dfx === point.dfx) {
        return pivot;
    }
    if(end - start <= 1)
        return array[pivot].dfx > point.dfx? pivot -1 : pivot;
    if(array[pivot].dfx < point.dfx) {
        return locationOf(point, array, pivot, end);
    } else {
        return locationOf(point, array, start, pivot);
    }
}

function canvasDraw() {
    clearCanvas();
    for(var k in circles){
        var point = circles[k];

//        context.strokeStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + 0.3 + ')';
//        context.beginPath();
//        context.moveTo(0,0);
//        context.lineTo(point.x, point.y);
//        context.closePath();
//        context.stroke();

        drawCircle(point, 1);

        context.strokeStyle = 'rgba(' + 0 + ',' + 0 + ',' + 0 + ',' + 1 + ')';
        context.strokeText(k+' ('+point.dfx+')', point.x, point.y);
    }
}

function canvasMouseMove(e) {
    var target = e.target;
    mouse.x = e.pageX - target.offsetLeft;
    mouse.y = e.pageY - target.offsetTop;

    for(var i = 0; i < circles.length; i++) {
        var c = circles[i];

        if(window.tb.distAB(c, mouse) < 10) {
            circles[i].color = [34,0,162];
        } else {
            circles[i].color = color;

        }
    }
    canvasDraw();
}

function nearestElement() {

}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(point, alpha) {
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(' + point.color[0] + ',' + point.color[1] + ',' + point.color[2] + ',' + alpha + ')';
    context.beginPath();
    context.arc(point.x, point.y, point.radius, 0, Math.PI * 2, true);
    context.stroke();
    context.fillStyle = 'rgba(' + point.color[0] + ',' + point.color[1] + ',' + point.color[2] + ',' + alpha/2 + ')';
    context.fill();
    context.closePath();
}