import { createCanvas, createImageData } from "canvas";
import fs from "fs";
import Delaunator from "delaunator";
import Jimp from "jimp";

let args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  switch (process.argv[i]) {
    case "-o":
      args.output = process.argv[i + 1];
      break;
    case "-f":
      args.file = process.argv[i + 1];
      break;
    case "-p":
      args.pointCount = process.argv[i + 1];
      break;
    case "-help":
      console.log("=======================HELP PAGE=======================");
      console.log("USAGE: node index [flag] [value] [flag] [value]");
      console.log("-o: Output file.");
      console.log("-f: Input file.");
      console.log("-p: Point count for triangulation.");
      console.log("-help: This page.");
      console.log("=======================================================");
      process.exit(0);
      break;
    default:
      console.log("=======================HELP PAGE=======================");
      console.log("USAGE: node index [flag] [value] [flag] [value]");
      console.log("-o: Output file.");
      console.log("-f: Input file.");
      console.log("-p: Point count for triangulation.");
      console.log("-help: This page.");
      console.log("=======================================================");
      process.exit(0);
      break;
  }
}

const image = args.file
  ? args.file.replaceAll(/\s/gm, "")
  : () => {
      // Probably not the cleanest way to do this but I prefer it to an if statement so ¯\_(ツ)_/¯
      throw new Error("No file specified!");
    };
const output = args.output ?? "./out.png";

function edgesOfTriangle(t) {
  return [3 * t, 3 * t + 1, 3 * t + 2];
}

function pointsOfTriangle(delaunay, t) {
  return edgesOfTriangle(t).map((e) => delaunay.triangles[e]);
}

function xOfY(a, b, y) {
  if (Math.min(a[1], b[1]) > y || Math.max(a[1], b[1]) < y) return undefined;
  return (
    ((a[0] - b[0]) / (a[1] - b[1])) * y +
    (a[0] - ((a[0] - b[0]) / (a[1] - b[1])) * a[1])
  );
}

function minX(a, b, c, y) {
  return Math.min(
    xOfY(a, b, y) ?? Infinity,
    xOfY(a, c, y) ?? Infinity,
    xOfY(b, c, y) ?? Infinity
  );
}

function maxX(a, b, c, y) {
  return Math.max(
    xOfY(a, b, y) ?? -Infinity,
    xOfY(a, c, y) ?? -Infinity,
    xOfY(b, c, y) ?? -Infinity
  );
}

function forEachPointInTriangle(a, b, c, callback) {
  let mY = Math.min(a[1], b[1], c[1]);
  let MY = Math.max(a[1], b[1], c[1]);
  for (let y = mY; y <= MY; y++) {
    let mX = minX(a, b, c, y);
    let MX = maxX(a, b, c, y);
    for (let x = mX; x <= MX; x++) {
      callback(x, y);
    }
  }
}
function forEachTriangle(points, delaunay, callback) {
  for (let t = 0; t < delaunay.triangles.length / 3; t++) {
    callback(
      t,
      pointsOfTriangle(delaunay, t).map((p) => points[p])
    );
  }
}

Jimp.read(image, (err, pic) => {
  const width = pic.bitmap.width;
  const height = pic.bitmap.height;
  const pointCount = parseInt(args.pointCount ?? (width * height) / 500);
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  console.log(
    `Running! Image: ${image}, width: ${width}, height: ${height}, point count: ${pointCount}, output: ${output}`
  );
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  if (err) throw err;
  let arr = Array.from({ length: pointCount }, (v, k) => {
    return [
      Math.floor(Math.random() * width),
      Math.floor(Math.random() * height),
    ];
  });
  arr.push([0, 0], [width, 0], [0, height], [width, height]);
  let del = Delaunator.from(arr);
  forEachTriangle(arr, del, (i, triangle) => {
    let a = triangle[0];
    let b = triangle[1];
    let c = triangle[2];
    let avgs = [0, 0, 0];
    let cnt = 0;
    forEachPointInTriangle(a, b, c, (x, y) => {
      let data = pic.getPixelColor(x, y);
      data = Jimp.intToRGBA(data);
      avgs[0] += data.r;
      avgs[1] += data.g;
      avgs[2] += data.b;
      cnt++;
    });
    avgs[0] = Math.floor(avgs[0] / cnt);
    avgs[1] = Math.floor(avgs[1] / cnt);
    avgs[2] = Math.floor(avgs[2] / cnt);
    ctx.fillStyle = `rgb(${avgs[0]}, ${avgs[1]},${avgs[2]})`;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.lineTo(c[0], c[1]);
    ctx.lineTo(a[0], a[1]);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  });
  fs.writeFileSync(output, canvas.toBuffer());
});
