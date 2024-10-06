import { createStore } from 'solid-js/store';
import { createMemo, For } from 'solid-js';
import { useParams } from "@solidjs/router";

function Game() {

  const params = useParams();
  console.log(params);

  const [gameData, setGameData] = createStore({
    "players": [
      { "name": "Barry", "rounds": [42, 4, 19, 0, 23, 15, 11, 23, 22, 31, 55, 16, 0, 29, 0, 48, 0, 48, 9, 24, 48, 0, 0, 0, 18, 0, 22] },
      { "name": "James", "rounds": [11, 2, 9, 11, 41, 33, 0, 0, 0, 36, 56, 9, 49, 21, 38, 0, 28, 47, 3, 21, 0, 9, 11, 13, 0, 18, 0] },
      { "name": "Susie", "rounds": [12, 0, 0, 27, 10, 0, 35, 21, 2, 0, 32, 0, 29, 0, 46, 69, 8, 37, 0, 0, 33, 18, 16, 24, 25, 10, 18] },
      { "name": "Kathy", "rounds": [0, 14, 12, 26, 0, 19, 16, 51, 20, 32, 0, 10, 6, 46, 3, 13, 6, 0, 10, 1, 12, 32, 35, 38, 21, 10, 37] }
    ],
    "maxScore": 500,

    // Refactored total function
    total(playerName) {
      const player = this.players.find((p) => p.name === playerName);
      if (!player) return 0;
      return player.rounds.reduce((total, score) => total + score, 0);
    },

    // Refactored biggestLoser function
    biggestLoser() {
      const lastRound = this.players.map((p) => p.rounds[p.rounds.length - 1]);
      const loserIndex = lastRound.indexOf(Math.max(...lastRound));
      const loserPlayer = this.players[loserIndex];
      return {
        name: loserPlayer.name,
        score: lastRound[loserIndex],
        round: loserPlayer.rounds.length,
      };
    },
  });

  const addRound = () => {
    const newRound = gameData.players.map(() =>
      Math.floor(Math.random() * 61)
    );
    const zeroIndex = Math.floor(Math.random() * newRound.length);
    newRound[zeroIndex] = 0; // Ensure one zero

    newRound.forEach((score, index) => {
      setGameData('players', index, 'rounds', (rounds) => [...rounds, score]);
    });
  };

  // Memo to reverse rounds reactively
  const reversedRounds = createMemo(() => {
    const rounds = gameData.players[0]?.rounds.length || 0;
    return Array.from({ length: rounds }, (_, i) => i).reverse();
  });

  // Memo to sort players by total score
  const leaderboardPlayers = createMemo(() =>
    [...gameData.players].sort(
      (a, b) => gameData.total(a.name) - gameData.total(b.name)
    )
  );

  return (
    <div class="flex items-center justify-center">

      <div class="w-96 px-4 py-4">
        {/* Header */}
        <div class="flex justify-between items-center mb-4">
          <div>
            <div class="badge badge-secondary badge-outline">TENS</div>
            <h2 class="text-xl">Dinner at the Intermarché</h2>
            <div class="text-sm text-neutral-500">27 September 2024</div>
          </div>
          <div>
            <button class="btn btn-square btn-ghost">
              <svg
                class="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Summary */}
        <div class="stats shadow mb-4 w-full">
          <div class="stat">
            <div class="stat-title">Rounds Played</div>
            <div class="stat-value">{gameData.players[0].rounds.length} </div>
            <div class="stat-actions">
              <button class="btn btn-sm btn-primary" onClick={addRound}>
                + Round {gameData.players[0].rounds.length + 1}
              </button>
            </div>
          </div>
          <div class="stat">
            <div class="stat-title">Biggest Loser</div>
            <div class="stat-value">{gameData.biggestLoser().name}</div>

            <div class="stat-desc">
              {gameData.biggestLoser().score} points in Round{' '}
              {gameData.biggestLoser().round}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <h3 class="py-2">Totals</h3>
        <div>
          {leaderboardPlayers().map((player, index) => (
            <div class="flex flex-col-1" key={index}>
              <div class="flex items-center p-2 bg-gray-100 rounded mb-2 w-full">
                <span class="px-4 text-left text-xl font-extrabold">
                  {index + 1}
                </span>
                <div class="avatar placeholder px-2">
                  <div class="bg-gray-400 text-neutral-content dark:text-white w-12 rounded-full">
                    <span class="text-xl">{player.name.charAt(0)}</span>
                  </div>
                </div>
                <span class="flex-1 text-left text-sm px-2">{player.name}</span>
                <div
                  class="radial-progress bg-transparent border-base-600 border-2"
                  style={{
                    '--size': '4rem',
                    '--thickness': '6px',
                    '--value':
                      (100 * gameData.total(player.name)) / gameData.maxScore,
                  }}
                  role="progressbar"
                >
                  <span class="text-xl font-extrabold">
                    {gameData.total(player.name)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Game Details */}
        <h3 class="py-2">Rounds</h3>
        <div class="overflow-x-auto">
          <table class="table-auto w-full border">
            <thead class="border">
              <tr>
                <th class="text-xs text-center">Player</th>
                <th class="text-xs text-center">Total</th>
                <For each={reversedRounds()}>
                  {(roundIndex) => (
                    <th key={roundIndex} class="px-4 py-2 text-sm">
                      {roundIndex + 1}
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={gameData.players}>
                {(player, playerIndex) => (
                  <tr key={playerIndex()}>
                    <td class="px-2 py-2 text-sm">
                      <div class="flex flex-col items-center">
                        <div class="avatar placeholder">
                          <div class="bg-gray-400 text-neutral-content dark:text-white w-12 rounded-full">
                            <span class="text-xl">{player.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div class="text-xs">{player.name}</div>
                      </div>
                    </td>
                    <td class="px-4 py-2 text-center text-sm">
                      {gameData.total(player.name)}
                    </td>
                    <For each={reversedRounds()}>
                      {(roundIndex) => (
                        <td class="px-4 py-2 text-center text-sm">
                          {player.rounds[roundIndex]}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Game;
