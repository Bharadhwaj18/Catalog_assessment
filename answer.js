const fs = require("fs").promises;

function decodeValue(base, value) {
  return parseInt(value, parseInt(base));
}

function lagrangeBasis(points, i, x) {
  const n = points.length;
  let term = 1;

  for (let j = 0; j < n; j++) {
    if (j !== i) {
      term *= (x - points[j].x) / (points[i].x - points[j].x);
    }
  }

  return term;
}

function lagrangePolynomial(points) {
  const k = points.length;
  return function (x) {
    let result = 0;

    for (let i = 0; i < k; i++) {
      const li = lagrangeBasis(points, i, x);
      result += points[i].y * li;
    }

    return result;
  };
}

function findConstantTerm(points) {
  const polynomial = lagrangePolynomial(points);
  return Math.round(polynomial(0));
}

async function processInputFile(filePath) {
  const inputData = JSON.parse(await fs.readFile(filePath, "utf8"));

  const points = Object.keys(inputData)
    .filter((key) => key !== "keys")
    .map((key) => ({
      x: parseInt(key),
      y: decodeValue(inputData[key].base, inputData[key].value),
    }))
    .slice(0, inputData.keys.k);

  const constantTerm = findConstantTerm(points);

  return { filePath, constantTerm };
}

async function main() {
  try {
    const results = await Promise.all([
      processInputFile("input1.json"),
      processInputFile("input2.json"),
    ]);

    results.forEach((result) => {
      console.log(
        `Constant Term from ${result.filePath}:`,
        result.constantTerm
      );
    });

    await fs.writeFile("output.json", JSON.stringify(results));
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

main();
