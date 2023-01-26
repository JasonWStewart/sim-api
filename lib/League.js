class League {
  constructor(inputData) {
    this.allFixtures = inputData.pageProps?.matches.data.allMatches ?? inputData.matches.data.allMatches;
    this.northTable =
      inputData.pageProps?.table[0].data.tables[0].table.all ?? inputData.table[0].data.tables[0].table.all;
    this.southTable =
      inputData.pageProps?.table[0].data.tables[1].table.all ?? inputData.table[0].data.tables[1].table.all;
  }

  get southTeams() {
    const teams = [];
    for (let team of this.southTable) {
      teams.push(team.name);
    }
    return teams;
  }

  get northTeams() {
    const teams = [];
    for (let team of this.northTable) {
      teams.push(team.name);
    }
    return teams;
  }

  get northFixtures() {
    const northFixtures = [];
    for (let fixture of this.allFixtures) {
      if (this.northTeams.indexOf(fixture.home.name) !== -1) {
        northFixtures.push(fixture);
      }
    }
    return northFixtures;
  }

  get southFixtures() {
    const southFixtures = [];
    for (let fixture of this.allFixtures) {
      if (this.southTeams.indexOf(fixture.home.name) !== -1) {
        southFixtures.push(fixture);
      }
    }
    return southFixtures;
  }

  filterRemainingFixtures(fixtures) {
    const remainingFixtures = [];
    for (let fixture of fixtures) {
      if (!fixture.status.started && !fixture.status.cancelled) {
        remainingFixtures.push(fixture);
      }
    }
    return remainingFixtures;
  }

  teamFixtures(team) {
    let teamFixtures = [];
    if (team) {
      this.allFixtures.forEach((fixture) => {
        if (
          fixture.home.name.toLowerCase() === team.toLowerCase() ||
          fixture.away.name.toLowerCase() === team.toLowerCase()
        ) {
          teamFixtures.push(fixture);
        }
      });
    }
    return teamFixtures;
  }

  fixtureOutcome(team, fixture) {
    if (!fixture.status.finished || fixture.status.cancelled) {
      return null;
    }
    // extract scores from the score-string
    let homeScore = Number(fixture.status.scoreStr.slice(0, 1));
    let awayScore = Number(fixture.status.scoreStr.slice(4));

    if (fixture.home.name.toLowerCase() === team.toLowerCase()) {
      if (homeScore > awayScore) {
        return "win";
      } else if (homeScore < awayScore) {
        return "lose";
      } else if (homeScore === awayScore) {
        return "draw";
      } else {
        return null;
      }
    } else if (fixture.away.name.toLowerCase() === team.toLowerCase()) {
      if (homeScore > awayScore) {
        return "lose";
      } else if (homeScore < awayScore) {
        return "win";
      } else if (homeScore === awayScore) {
        return "draw";
      } else {
        return null;
      }
    }
    return null;
  }

  teamPerformanceStats(team) {
    // [played, won, lost, drawn]
    const statsTable = [0, 0, 0, 0];

    for (let fixture of this.teamFixtures(team)) {
      switch (this.fixtureOutcome(team, fixture)) {
        case "win": {
          statsTable[0]++;
          statsTable[1]++;
          break;
        }
        case "lose": {
          statsTable[0]++;
          statsTable[2]++;
          break;
        }
        case "draw": {
          statsTable[0]++;
          statsTable[3]++;
          break;
        }
        default:
          break;
      }
    }
    // first value is the percentage of games lost, second is the percentage of games either lost or drawn
    return [
      Math.floor((statsTable[2] / statsTable[0]) * 100),
      Math.floor(((statsTable[2] + statsTable[3]) / statsTable[0]) * 100),
    ];
  }

  initialiseDataTable(currentTable) {
    const table = {};
    for (let team of currentTable) {
      table[team.name] = {
        performance: this.teamPerformanceStats(team.name),
        currentPoints: team.pts,
        simulationData: {},
      };
    }
    return table;
  }

  initialisePositionTable(currentTable) {
    const table = {};
    const initialPositions = [];
    currentTable.forEach(() => initialPositions.push(0));
    for (let team of currentTable) {
      table[team.name] = [...initialPositions];
    }
    return table;
  }
}

module.exports = {
  League,
};
