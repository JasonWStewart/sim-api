const express = require("express");
const path = require("path");

const app = express();
const port = 8080;
const iterations = +process.argv[process.argv.indexOf("-i") + 1] || 10000;
const dateString = new Date().toISOString().slice(0, 10);

app.get("/sim/north", (req, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, `./output/north/${dateString}-LeaguePredictions[${iterations}].json`));
});

app.get("/sim/south", (req, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(path.join(__dirname, `./output/south/${dateString}-LeaguePredictions[${iterations}].json`));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
