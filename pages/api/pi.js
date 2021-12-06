const { readJson, writeJson } = require("../../services/json");

const getLatestPi = async () => {
  return await readJson("./data/pi.json");
};

// Nilakantha series algorithm
// π = 3 + 4/(2*3*4) - 4/(4*5*6) + 4/(6*7*8) - 4/(8*9*10) + 4/(10*11*12) - 4/(12*13*14) ...

// const calculatePi = async () => {
//   let data = await getLatestPi();
//   let pi = data.pi || 3;
//   let x = data.x || 2;
//   let count = data.count || 1;

//   function update() {
//     if (count % 2) {
//       pi = pi + 4 / (x * (x + 1) * (x + 2));
//     } else {
//       pi = pi - 4 / (x * (x + 1) * (x + 2));
//     }
//     x += 2;
//     count++;

//     return setTimeout(() => {
//       writeJson({ pi, x, count }, "./data/pi.json");
//       update();
//     }, 1000);
//   }

//   update();
// };

// Taylor series algorithm
const calculatePi = async () => {
  let data = await getLatestPi();
  let x = data.x ? BigInt(data.x) : 3n * 10n ** 120n; // upto 100 decimals
  let i = data.i ? BigInt(data.i) : 1n;
  let pi = data.pi ? BigInt(data.pi) : x;

  function update() {
    x = (x * i) / ((i + 1n) * 4n);
    pi += x / (i + 2n);
    i += 2n;

    return setTimeout(() => {
      writeJson({ pi, x, i }, "./data/pi.json");
      if (x > 0) {
        update();
      }
    }, 1000);
  }

  update();
};

calculatePi();

export default async function handler(req, res) {
  // Get data from your database
  const { pi = 3n * 10n ** 120n } = await getLatestPi();
  const piString = (BigInt(pi) / 10n ** 20n).toString();
  const displayPi = piString.slice(0, 1) + "." + piString.slice(1);
  res.status(200).json({ displayPi });
}
