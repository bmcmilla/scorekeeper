import { createStore, produce } from 'solid-js/store';
import { createMemo, createSignal, For, Index, onMount, Show } from 'solid-js';
import { useParams } from "@solidjs/router";
import { createRound, deleteRound, getGame } from '../api/GameClient';

/** TODO
 * Error state (game not found)
 * No auth state
 * Title / maxScore editor
 * Unit testable data/stats functions
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

  const undoRound = () => {

    deleteRound(gameData.id, gameData.countRounds());

    // FIXME handle error

    setGameData(
      produce(game => {
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].rounds.pop();
        }
      }
      ));
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const round = gameData.players.map((player, index) => {
      return Number.parseInt(e.target[index].value) || 0;
    });


    const ids = [];
    round.forEach((round, index) => {
      const id = createRound(gameData.id, gameData.countRounds() + 1, index, round);
      ids.push(id);
    });
    console.log(ids);

    // FIXME handle errors

    setGameData(
      produce(game => {
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].rounds.push(round[i]);
        }
      }
      ));
    document.getElementById('new_round_modal').close();
    e.target.reset();
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
        <div class="w-96 px-4 mb-8">
          {/* Header */}
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
              <div class="badge badge-secondary badge-outline text-xs">Tens</div>
              <h2 class="text-xl mt-2">{gameData.title}</h2>
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
          <Show when={gameData.players.length > 0}>
            <div class="stats shadow my-2 w-full">
              <div class="stat">
                <div class="stat-title">Rounds Played</div>
                <div class="stat-value">{gameData.countRounds()} </div>
                <div class="stat-actions">
                  <button class="btn btn-primary btn-sm" onClick="new_round_modal.showModal()">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                    </svg>
                    Round {gameData.countRounds() + 1}
                  </button>
                  <dialog id="new_round_modal" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                      <form onSubmit={onSubmit}>
                        <h3 class="text-lg font-bold mb-2">Round {gameData.countRounds() + 1}</h3>
                        <Index each={gameData.players}>{(player) => (
                          <div class="grid grid-cols-2 items-center">
                            <label class="text-lg py-4">{player().name}</label>
                            <input
                              type="number"
                              placeholder="0"
                              id={"new-round-" + player().name}
                              name={"new-round-" + player().name}
                              class="input input-bordered justify-center" />
                          </div>
                        )}
                        </Index>
                        <button class="btn btn-primary mt-4" type="submit">Add Round</button>
                      </form>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                      <button>Cancel</button>
                    </form>
                  </dialog>
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

          {/* Round Table */}
          <Show when={gameData.countRounds() > 0}>
            <div class="flex flex-row justify-between mt-4">
              <h3>Rounds</h3>
            </div>
            <div class="overflow-x-auto justify-left">
              <table class="table-zebra table-xs">
                <thead>
                  <tr>
                    <th></th>
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
                            <td class="px-4 py-2 text-sm text-center">
                              {player.rounds[roundIndex]}
                            </td>
                          )}
                        </For>
                        <td class="w-full"></td>
                      </tr>
                    )}
                  </For>
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                    <For each={reversedRounds()}>
                      {(roundIndex) => (
                        <Show when={roundIndex == reversedRounds().length - 1} fallback={<th></th>}>
                          <td>
                            <div class="tooltip" data-tip={"Delete Round " + (roundIndex + 1)}>
                              <button class="btn btn-xs" onClick={undoRound}>
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </Show>
                      )}
                    </For>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}

export default Game;
