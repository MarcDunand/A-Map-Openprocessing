
let scale = 0.0625;
let roomArr = [];
let hallArr = [];
let roomBuff = 64*scale;  //min space between rooms
let tile = 16*scale; //passage size, minimum size (for now)

function flr(x) {  //floors input to multiple of tile
	return tile*floor(x/tile);
}

function drawGrid(x) {  //draws grid of step x
	push();
	stroke(255, 0, 0, 40);
	strokeWeight(1);
	for(let i = 0; i < windowWidth; i += x) {
		line(i, 0, i, windowHeight);
	}
	for(let i = 0; i < windowHeight; i += x) {
		line(0, i, windowWidth, i);
	}
	pop();
}

function binarySplit(x1, w, y1, h) {
	if(w < 5*roomBuff || h < 5*roomBuff) {
		var randx = random(roomBuff);
		var randy = random(roomBuff);
		roomArr.push([flr(x1 + randx), flr(y1 + randy), flr((w - randx) - random(roomBuff)), flr((h - randy) - random(roomBuff))]);
		return;
	}
	else {
		var vSplit = random(roomBuff, w - roomBuff);
		var hSplit = random(roomBuff, h - roomBuff);

		var hMin = min(vSplit, w-vSplit);
		var vMin = min(hSplit, h-hSplit);

		var isHSplit = (vMin <= hMin);
		
		var randx1 = roomBuff//random(roomBuff);
		var randy1 = roomBuff//random(roomBuff);
		var randx2 = roomBuff//random(roomBuff);
		var randy2 = roomBuff//random(roomBuff);

		if(isHSplit) {
			binarySplit(flr(x1), flr(vSplit), flr(y1), flr(h));
			binarySplit(flr(x1 + vSplit), flr((w - vSplit)), flr(y1), flr(h));
		}
		else {
			binarySplit(flr(x1), flr(w), flr(y1), flr(hSplit));
			binarySplit(flr(x1), flr(w), flr(y1 + hSplit + randy2), flr(((h - hSplit) - randy2) - random(roomBuff)));
		}
		
		
		// if(!isVSplit) {
		// 	binarySplit(flr(x1 + randx1), flr((vSplit - randx1) - random(roomBuff)), flr(y1 + randy1), flr((h - randy1) - random(roomBuff)));
		// 	binarySplit(flr(x1 + vSplit + randx2), flr(((w - vSplit) - randx2) - random(roomBuff)), flr(y1 + randy2), flr((h - randy2) - random(roomBuff)));
		// }
		// else {
		// 	binarySplit(flr(x1 + randx1), flr((w - randx1) - random(roomBuff)), flr(y1 + randy1), flr((hSplit - randy1) - random(roomBuff)));
		// 	binarySplit(flr(x1 + randx2), flr((w - randx2) - random(roomBuff)), flr(y1 + hSplit + randy2), flr(((h - hSplit) - randy2) - random(roomBuff)));
		// }
		return;
	}
}

function pseudoRandWalk(x, y, dir, len) {
	var dirMap = [[0, -1], [1, 0], [0, 1], [-1, 0]]; //up, right, down, left
	
	for(var i = 0; i < len; i++) {
		//print(dir);
		if(random() < 0.05) { //turn right
			dir = (dir + 1) % 4;
		}
		else if(random() > 0.95) { //turn left
			dir -= 1;
			if(dir == -1) { //not using mod because p5.js is stoopid
				dir = 3;
			}
		}
		else {
			square(x, y, 0.0625);
			x = x+tile*dirMap[dir][0];
			y = y+tile*dirMap[dir][1];
		}
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	fill(255);
	stroke(0);
	strokeWeight(1)
	
	binarySplit(0, windowWidth, 0, windowHeight);
				
	for(i = 0; i < roomArr.length; i++) {
		var x = roomArr[i][0];
		var y = roomArr[i][1];
		var w = roomArr[i][2];
		var h = roomArr[i][3];
		
		var circumference = 2*(w+h);
		
		var hallLen = 40;
		var hallWidth = 15;
		var distPHall = 5000;
		
		var hallCount = circumference/distPHall + 2;
		var wallPercent = h/(w+h)
		
		for(j = 0; j < hallCount; j++) {
			if(random() < wallPercent) { //start from wall
				if(random() < 0.5) { //start from left wall
					pseudoRandWalk(x, flr(random(y, y+h)), 3, hallLen);
				}
				else { //start from right wall
					pseudoRandWalk(x+w, flr(random(y, y+h)), 1, hallLen);
				}
			}
			else { //start from floor/ceiling
				if(random() < 0.5) { //start from ceiling
					pseudoRandWalk(flr(random(x, x+w)), y, 0, hallLen);
				}
				else { //start from floor
					pseudoRandWalk(flr(random(x, x+w)), y+h, 2, hallLen);
				}
			}
			
		}
	}
		
	for(i = 0; i < roomArr.length; i++) {
		rect(roomArr[i][0], roomArr[i][1], roomArr[i][2], roomArr[i][3]);
	}
	//drawGrid(tile);
}
