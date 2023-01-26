const fs = require("fs");
const { League } = require("./lib/League");
const simulator = require("./lib/Simulation");

const iterations = +process.argv[process.argv.indexOf("-i") + 1] || 10000;

const dateString = new Date().toISOString().slice(0, 10);
const filePath = `./data/${dateString}-fotmobData.json`;

let fotmobData = JSON.parse(fs.readFileSync(filePath));

const league = new League(fotmobData);

function runSouthSimulation(iterations) {
  if (fs.existsSync(`./output/south/${dateString}-LeaguePredictions[${iterations}].json`)) {
    return;
  }
  console.log("Simulating National League South...");
  const newDataTable = league.initialiseDataTable(league.southTable);
  const newPositionTable = league.initialisePositionTable(league.southTable);
  const leagueFixtures = league.filterRemainingFixtures(league.southFixtures);
  const results = simulator.leagueSimulation(newDataTable, leagueFixtures, newPositionTable, iterations, false);
  fs.writeFileSync(`./output/south/${dateString}-LeaguePredictions[${iterations}].json`, JSON.stringify(results));
  console.log("created file", `./output/south/${dateString}-LeaguePredictions[${iterations}].json`);
  return 1;
}

function runNorthSimulation(iterations) {
  if (fs.existsSync(`./output/north/${dateString}-LeaguePredictions[${iterations}].json`)) {
    return;
  }
  console.log("Simulating National League North...");
  const newDataTable = league.initialiseDataTable(league.northTable);
  const newPositionTable = league.initialisePositionTable(league.northTable);
  const leagueFixtures = league.filterRemainingFixtures(league.northFixtures);
  const results = simulator.leagueSimulation(newDataTable, leagueFixtures, newPositionTable, iterations, false);
  fs.writeFileSync(`./output/north/${dateString}-LeaguePredictions[${iterations}].json`, JSON.stringify(results));
  console.log("created file", `./output/north/${dateString}-LeaguePredictions[${iterations}].json`);
  return 1;
}

runSouthSimulation(iterations);
runNorthSimulation(iterations);
