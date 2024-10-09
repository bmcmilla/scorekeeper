import { createStore, produce } from 'solid-js/store';
import { createMemo, createSignal, For, onMount, Show } from 'solid-js';
import { useParams } from "@solidjs/router";
import { getGame } from '../api/GameClient';

/** TODO
 * Loading state
 * Error state (game not found)
 * no auth state
 * New game state
 * Title / maxScore editor
 * Add round form
 * Delete round button
 * Fix dark mode
 * Unit testable data/stats functions
 * Grid layout leaders/new round
 * Check valid new round scores
*/

function Game() {

  const params = useParams();

  onMount(async () => {
    const game = await getGame(Number.parseInt(params.id));
    setGameData(
      produce(g => {
        g.id = game.id;
        g.title = game.title;
        g.maxScore = game.maxScore;
        g.players = game.players;
        g.createdAt = game.createdAt;
      })
    );
    setLoading(false);
  });

  const [loading, setLoading] = createSignal(true);
  const [editor, setEditor] = createSignal(false);
  const [gameData, setGameData] = createStore({
    id: 0,
    title: '',
    maxScore: 0,
    players: [],
    createdAt: new Date(),

    total(playerName) {
      if (this.players.length === 0) return 0;
      const player = this.players.find((p) => p.name === playerName);
      if (!player) return 0;
      return player.rounds.reduce((total, score) => total + score, 0);
    },

    biggestLoser() {
      if (this.countRounds() === 0) return undefined;

      const lastRound = this.players.map((p) => p.rounds[p.rounds.length - 1]);
      const loserIndex = lastRound.indexOf(Math.max(...lastRound));
      const loserPlayer = this.players[loserIndex];
      return {
        name: loserPlayer.name,
        score: lastRound[loserIndex],
        round: loserPlayer.rounds.length,
      };
    },

    countRounds() {
      return this.players.length > 0 ? this.players[0].rounds.length : 0;
    }
  });

  const newRound = () => {
    setEditor(!editor())
  };

  const undoRound = () => {
    setGameData(
      produce(game => {
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].rounds.pop();
        }
      }
      ));
  }

  const isRoundValid = () => {
    return true;
  }

  const onSubmit = (e) => {
    const round = [
      Number.parseInt(e.target[0].value) || 0,
      Number.parseInt(e.target[1].value) || 0,
      Number.parseInt(e.target[2].value) || 0,
      Number.parseInt(e.target[3].value) || 0,
    ];
    setGameData(
      produce(game => {
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].rounds.push(round[i]);
        }
      }
      ));
    setEditor(false);
  };

  // Memo to reverse rounds reactively
  const reversedRounds = createMemo(() => {
    const rounds = gameData.players[0]?.rounds.length || 0;
    return Array.from({ length: rounds }, (_, i) => i).reverse();
  });

  // Memo to sort players by total score
  const leaders = createMemo(() => {
    return [...gameData.players].sort(
      (a, b) => gameData.total(a.name) - gameData.total(b.name)
    )
  });

  return (
    <div class="flex items-center justify-center">
      <Show when={!loading()} fallback={<span class="loading loading-dots loading-lg"></span>}>
        <div class="w-96 px-4 py-4">
          {/* Header */}
          <div class="flex justify-between items-center mb-4">
            <div>
              <div class="badge badge-secondary badge-outline">TENS</div>
              <h2 class="text-xl">{gameData.title} ({gameData.maxScore})</h2>
              <div class="text-sm text-neutral-500">{gameData.createdAt.toDateString()}</div>
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

          {/* Stats */}
          <Show when={!editor() && gameData.players.length > 0}>
            <div class="stats shadow mb-4 w-full">
              <div class="stat">
                <div class="stat-title">Rounds Played</div>
                <div class="stat-value">{gameData.countRounds()} </div>
                <div class="stat-actions">
                  <button class="btn btn-sm btn-primary" onClick={newRound}>
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                    </svg>
                    Round {gameData.countRounds() + 1}
                  </button>
                </div>
              </div>
              <Show when={gameData.countRounds() > 0}>
                <div class="stat">
                  <div class="stat-title">Biggest Loser</div>
                  <div class="stat-value">{gameData.biggestLoser().name}</div>
                  <div class="stat-desc">
                    {gameData.biggestLoser().score} points in Round{' '}
                    {gameData.biggestLoser().round}
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          {/* New Round */}
          <Show when={editor()}>
            <h3 class="py-2">Round {gameData.countRounds() + 1}</h3>
            <div>
              <form action="#" onSubmit={onSubmit}>
                <For each={Object.values(gameData.players)}>{(player, index) => (
                  <div class="flex flex-col-1">
                    <div class="flex items-center p-2 rounded mb-2 w-full bg-gray-100">
                      <span class="px-4 text-left text-xl font-extrabold">
                        {index() + 1}
                      </span>
                      <div class="avatar placeholder px-2">
                        <div class="bg-gray-400 text-neutral-content w-12 rounded-full">
                          <span class="text-xl">{player.name.charAt(0)}</span>
                        </div>
                      </div>
                      <span class="flex-1 text-left text-sm px-2">{player.name}</span>
                      <div class="w-20">
                        <input
                          type="text"
                          placeholder="0"
                          id={"new-round-" + index()}
                          class="input input-bordered input-lg w-full max-w-xs text-center" />
                      </div>
                    </div>
                  </div>
                )}
                </For>
                <div class="flex items-center justify-center space-x-4">
                  <div><button type="submit" class="btn btn-primary" disabled={!isRoundValid()}>Add Round</button></div>
                  <div><button class="btn" onClick={() => setEditor(false)}>Cancel</button></div>
                </div>
              </form>
            </div>
          </Show>

          {/* Leaders */}
          <h3 class="py-2">Leaders</h3>
          <div>
            <For each={leaders()}>{(player, index) => (
              <div class="flex flex-col">
                <div class="flex flex-row items-center px-2 py-2 rounded-xl mb-2 w-full bg-base-200">
                  <span class="px-4 text-left text-xl font-extrabold">
                    {index() + 1}
                  </span>
                  <div class="avatar placeholder px-2">
                    <div class="bg-neutral text-neutral-content w-12 rounded-full">
                      <span class="text-xl font-semibold">{player.name.charAt(0)}</span>
                    </div>
                  </div>
                  <span class="flex-1 text-left text-md px-2">{player.name}</span>
                  <div
                    class="radial-progress bg-transparent border-base-600 border-0"
                    style={{
                      '--size': '4rem',
                      '--thickness': '6px',
                      '--value':
                        (100 * gameData.total(player.name)) / gameData.maxScore,
                    }}
                    role="progressbar">
                    <span class="text-xl font-extrabold">
                      {gameData.total(player.name)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            </For>
          </div>

          {/* Round Details */}
          <Show when={gameData.countRounds() > 0}>
            <div class="flex flex-row justify-between">
              <h3 class="mt-4">Rounds</h3>
              <div class="dropdown dropdown-top dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-square">
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
                </div>
                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><a onClick={undoRound}>Delete Round {gameData.countRounds()}</a></li>
                </ul>
              </div>
            </div>
            <div class="overflow-x-auto justify-left">
              <table class="table-zebra table-xs">
                <thead>
                  <tr>
                    <th class="text-xs text-center">Player</th>
                    <For each={reversedRounds()}>
                      {(roundIndex) => (
                        <th class="px-4 py-2 text-sm">
                          {roundIndex + 1}
                        </th>
                      )}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={gameData.players}>
                    {(player) => (
                      <tr>
                        <td class="px-2 py-2 text-sm">
                          <div class="flex flex-col items-center">
                            <div class="avatar placeholder">
                              <div class="bg-neutral text-neutral-content w-12 rounded-full">
                                <span class="text-xl">{player.name.charAt(0)}</span>
                              </div>
                            </div>
                            <div class="text-xs">{player.name}</div>
                          </div>
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
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default Game;
