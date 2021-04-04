const videoEl = document.getElementById('video');
const outputEl = document.getElementById('output');

// class Circle {
//   constructor(x, y, d) {
//     this.x = x;
//     this.y = y;
//     this.d = d;
//     this.r = d / 2;

//     this.x += this.r;
//     this.y += this.r;

//     this.vX = random(-1, 1);
//     this.vY = random(-1, 1);
//   }

//   draw = () => {
//     noFill();
//     stroke(255, 0, 255);
//     circle(this.x, this.y, this.d);
//   }

//   move = (balls) => {
//     if (this.x >= width - this.r || this.x < 0 + this.r) {
//       this.vX *= -1;
//     }
//     if (this.y >= height - this.r || this.y < 0 + this.r) {
//       this.vY *= -1;
//     }

//     balls.forEach(ball => {
//       if (ball.x === this.x && ball.y === this.y) return;

//       let xLen = ball.x - this.x;
//       let yLen = ball.y - this.y;

//       let dis = sqrt(sq(xLen) + sq(yLen));

//       if (dis <= ball.r + this.r) {
//         this.bounce();
//         ball.bounce();
//       }
//     })

//     this.x += this.vX;
//     this.y += this.vY;
//   }

//   bounce = (ball) => {
//     this.vX *= -1;
//     this.vy *= -1;
//   }
// }

// let count = 10;
// let balls = [];



let heat = [];



const BLEND_SELF = 2;
const BLEND_NEIGHBOR_1 = 3;
const BLEND_NEIGHBOR_2 = 2;
const BLEND_NEIGHBOR_3 = 1;
let BLEND_HOR = 2;
const BLENDING = () => (BLEND_NEIGHBOR_1 + BLEND_NEIGHBOR_2 + BLEND_NEIGHBOR_3 + BLEND_SELF + (BLEND_HOR * 2));
let COOLING = 0
let size;

let arrayWidth;
function colorTemp(val, redMod = 50, greenMod = 100, blueMod = 200) {
  const max = 255;

  const redMax = max - redMod;
  const greenMax = max - greenMod;
  const blueMax = max - blueMod;

  let red = val - redMod;
  let green = val - greenMod;
  let blue = val - blueMod;

  red = map(red, 0, redMax, 0, max);
  green = map(green, 0, greenMax, 0, max);
  blue = map(blue, 0, blueMax, 0, max);

  return color(red, green, blue);
}
const cellWidth = 10



function setup() {

  createCanvas(400, 300);
  arrayWidth = width / cellWidth;
  size = height / cellWidth;
  colorMode(RGB, 255);
  // for (let i = 0; i < count; i++) {
  //   balls.push(new Circle(Math.max(50, random(width - 50)), Math.max(50, random(height - 50)), random(10, 50)))
  // }

  redP = createP('Red')
  redSlide = createSlider(0, 255, 200);
  greenP = createP('Green')
  greenSlide = createSlider(0, 255, 100);
  blueP = createP('Blue')
  blueSlide = createSlider(0, 255, 50);

  createP('Cooling')
  coolSlide = createSlider(0, 100, 40, 1);
  createP('Blending')
  blendSlide = createSlider(2, 7, 2, 1);

  checkbox = createCheckbox('HSB?', false);
  checkbox.changed(hsbCheck);

  heat = new Array(width * height / (cellWidth * cellWidth)).fill(0);

  console.log(heat.length, arrayWidth, size);

  strokeWeight(cellWidth);
  strokeCap(SQUARE);
  background(0);


  // frameRate(1)
  // if (coun)
  for (let count = 0; count < 20; count++) {

  }

}

let counter = 0;
function draw() {
  let red = 255 - redSlide.value();
  let green = 255 - greenSlide.value();
  let blue = 255 - blueSlide.value();
  COOLING = coolSlide.value();
  BLEND_HOR = blendSlide.value();

  for (let i = 0; i < heat.length; i++) {
    let cooling = COOLING + random(-40, 40)
    heat[i] = Math.max(0, heat[i] - random(0, ((cooling * 10) / size) + 2));
    // heat[i] = Math.max(0, heat[i] - random(0, ((random(COOLING, COOLING + 20) * 10) / size) + 2));
  }

  const defaultVal = 200
  for (let i = 0; i < heat.length; i++) {
    let magicBlend = Math.max(1, Math.min(10, random(-2, 2) + BLEND_HOR))

    heat[i] = (
      (heat[i] * BLEND_SELF) +
      ((heat[i + arrayWidth] ?? defaultVal) * BLEND_NEIGHBOR_1) +
      ((heat[i + (arrayWidth * 2)] ?? defaultVal) * BLEND_NEIGHBOR_2) +
      ((heat[(i + 1)] ?? defaultVal) * magicBlend) +
      ((heat[(i - 1)] ?? defaultVal) * magicBlend) +
      ((heat[i + (arrayWidth * 3)] ?? defaultVal) * BLEND_NEIGHBOR_3)
    ) / (BLENDING() + magicBlend - BLEND_HOR);
  }

  for (let i = 0; i < heat.length; i++)
    if (i > heat.length - (arrayWidth * random(1, 2)) - 1 && random(255) < 100)
      heat[i] = Math.min(255, heat[i] + random(0, 255));

  for (let i = 0; i < heat.length; i++) {
    let x = i % (arrayWidth);
    let y = (i - x) / (arrayWidth);

    let color = colorTemp(heat[i], red, green, blue);
    // color.mult(heat[i]);

    stroke(color);
    // stroke(heat[i], 0, heat[i]);
    point(x * cellWidth + (cellWidth / 2), y * cellWidth + (cellWidth / 2));
  }

}

function hsbCheck() {
  if (this.checked()) {
    colorMode(HSB, 255)
    redP.html('HUE')
    greenP.html('SAT')
    blueP.html('BRIGHT')
  }
  else {
    colorMode(RGB, 255)
    redP.html('Red')
    greenP.html('Green')
    blueP.html('Blue')
  }
}
