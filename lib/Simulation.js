function simulateFixture(homeProbability = [33, 66]) {
  let randInt = Math.floor(Math.random() * 100);
  if (randInt <= homeProbability[0]) {
    return 2;
  } else if (randInt <= homeProbability[1]) {
    return 1;
  } else {
    return 0;
  }
}

function simulateLeague(dataTable, leagueFixtures, randomPerformance = false) {
  const pointAwards = [
    [3, 0],
    [1, 1],
    [0, 3],
  ];

  const returnTable = [];

  for (let team in dataTable) {
    dataTable[team].simulationData.points = dataTable[team].currentPoints;
  }

  for (let fixture of leagueFixtures) {
    let outcome = randomPerformance ? simulateFixture() : simulateFixture(dataTable[fixture.home.name].performance);

    dataTable[fixture.home.name].simulationData.points += pointAwards[outcome][0];
    dataTable[fixture.away.name].simulationData.points += pointAwards[outcome][1];
  }

  for (let team in dataTable) {
    returnTable.push([team, dataTable[team].simulationData.points]);
  }

  returnTable.sort((a, b) => b[1] - a[1]);

  return returnTable;
}

function leagueSimulation(dataTable, leagueFixtures, positionTable, iterations = 100, randomPerformance = false) {
  let finalTable = [];
  for (let i = 0; i < iterations; i++) {
    finalTable = simulateLeague(dataTable, leagueFixtures, randomPerformance);
    finalTable.forEach((team, i) => {
      positionTable[team[0]][i]++;
    });
  }
  return positionTable;
}
module.exports = {
  leagueSimulation,
};
