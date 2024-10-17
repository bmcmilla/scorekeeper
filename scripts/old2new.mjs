const fs = require('fs');

// Function to transform data
function transformData(input) {
  const transformed = {};

  // Process each date in the input object
  for (const date in input) {
    const { players, rounds } = input[date];

    // Initialize transformed structure for each date
    transformed[date] = {
      players: [],
      maxScore: 0
    };

    // Variable to track total scores for each player
    const totalScores = new Array(players.length).fill(0);

    // Populate players' data with corresponding rounds
    for (let i = 0; i < players.length; i++) {
      let playerRounds = rounds.map(round => round[i]);
      transformed[date].players.push({
        name: players[i],
        rounds: playerRounds
      });

      // Sum the total score for each player
      totalScores[i] = playerRounds.reduce((sum, score) => sum + score, 0);
    }

    // Calculate the max total score across all players
    transformed[date].maxScore = Math.max(...totalScores);
  }

  return transformed;
}

// Read from the input file
fs.readFile('/Users/barrymc/Workspace/pontos/public/history.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  const inputData = JSON.parse(data);

  // Transform the data
  const outputData = transformData(inputData);

  // Output the transformed data to the console, but keep rounds on one line
  console.log(JSON.stringify(outputData, (key, value) => {
    // Only compress the "rounds" array into a single line
    if (key === 'rounds' && Array.isArray(value)) {
      return "[" + value.join(',') + "]";
    }
    return value;
  }, 2));
});