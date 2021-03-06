var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth, canvas.height = 800; 

//defining window dimensions
var xMin = -10, xMax = 10, yMin = -10, yMax = 10;

//defining window range 
var xSpace = xMax - xMin;
var ySpace = yMax - yMin;

//defining mathjs, expression string and scope
var math = mathjs(), expr = '', scope = { x : 0 };

//parse tree
var tree = math.parse(expr, scope);  // mathjs allows to parse expressions entered as strings

function drawCurveAndGraph() {
    var i, j, k, n = 100000, percentX, percentY, xPixel, yPixel, mathX, mathY, tickX, tickY;
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //ctx.drawGraph();

    //for x and y axes
    ctx.beginPath();
    ctx.moveTo(0,(1+yMin/ySpace)*canvas.height);
    ctx.lineTo(canvas.width,(1+yMin/ySpace)*canvas.height);
    ctx.moveTo((-xMin/xSpace)*canvas.width,0);
    ctx.lineTo((-xMin/xSpace)*canvas.width,canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    //for horizontal and vertical 
    ctx.beginPath();
    for(i = 0 ; i <= ySpace ; i++) {
        ctx.moveTo(0,((i*canvas.height)/ySpace));
        ctx.lineTo(canvas.width,((i*canvas.height)/ySpace));
    }
    for(j = 0 ; j <= xSpace ; j++) {
        ctx.moveTo(((j*canvas.width)/xSpace),0);
        ctx.lineTo(((j*canvas.width)/xSpace),canvas.height);
    }
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    //tick marks with values on the x and y axes respectively 
    ctx.beginPath();
    for(tickX = 0 ; tickX <= xSpace ; tickX++) {
        
        ctx.moveTo((tickX/xSpace)*canvas.width,((1+yMin/ySpace)*canvas.height)-3);
        ctx.lineTo((tickX/xSpace)*canvas.width,((1+yMin/ySpace)*canvas.height)+3);
        if (xMin + tickX === 0)
            continue;
        ctx.font = '12px Arial';
        ctx.align = 'start';
        ctx.fillText(xMin + tickX,(tickX*canvas.width)/xSpace,((1+yMin/ySpace)*canvas.height)+15);
    }
    for(tickY = 0 ; tickY <= ySpace ; tickY++) {
        
        ctx.moveTo(((-xMin/xSpace)*canvas.width)-3,(1-(tickY/ySpace)*canvas.height));
        ctx.lineTo(((-xMin/xSpace)*canvas.width)+3,(1-(tickY/ySpace)*canvas.height));
        if (yMax - tickY === 0)
            continue;
        ctx.font = '12px Arial';
        ctx.align = 'start';
        ctx.fillText(yMax - tickY,((-xMin/xSpace)*canvas.width)-15,(tickY/ySpace)*canvas.height);
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    //for graphing the actual function
    ctx.beginPath();
    for(k = 0 ; k < n  ; k++) {
        percentX = 1 - (k / (n - 1));
        mathX = (percentX*xSpace) + xMin;
        mathY = evaluateMathExpression(mathX);
        percentY = 1 - ((mathY - yMin) / ySpace);
        xPixel = percentX * canvas.width;
        yPixel = percentY * canvas.height;
        ctx.lineTo(xPixel,yPixel);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
}

function evaluateMathExpression(mathX) {
    scope.x = mathX;
    return tree.eval();
}

document.querySelector('#field').addEventListener('keyup',function() { 
    expr = document.querySelector('#field').value;
    tree = math.parse(expr, scope);
    drawCurveAndGraph();
}); 

document.getElementById('xmin').addEventListener('keyup',function() {
    xMin = parseInt(document.querySelector('#xmin').value);
    xSpace = xMax - xMin;
    drawCurveAndGraph();
});

document.getElementById('xmax').addEventListener('keyup',function() {
    xMax = parseInt(document.querySelector('#xmax').value);
    xSpace = xMax - xMin;
    drawCurveAndGraph();
});

document.getElementById('ymin').addEventListener('keyup',function() {
    yMin = parseInt(document.querySelector('#ymin').value);
    ySpace = yMax - yMin;
    drawCurveAndGraph();
});

document.getElementById('ymax').addEventListener('keyup',function() {
    yMax = parseInt(document.querySelector('#ymax').value);
    ySpace = yMax - yMin;
    drawCurveAndGraph();
});