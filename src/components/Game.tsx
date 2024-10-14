import { createStore, produce } from 'solid-js/store';
import { createMemo, createSignal, For, Index, onMount, Show } from 'solid-js';
import { useNavigate, useParams } from "@solidjs/router";
import { createRound, deleteGame, deleteRound, getGame, updateGame } from '../api/GameClient';
import LoadingIndicator from './LoadingIndicator';
import ConfirmationDialog from './ConfirmationDialog';
import { AudioPlayer } from '../Audio';

/** TODO
 * Error state (game not found)
 * No auth state
 * Unit testable data/stats functions
 * Check valid new round scores
 * Use context to separate components
*/

function Game() {

  const params = useParams();

  const navigate = useNavigate();

  const audio = new AudioPlayer();

  const [loading, setLoading] = createSignal(true);
  const [gameData, setGameData] = createStore({
    id: 0,
    title: '',
    maxScore: 0,
    players: [],
    createdAt: new Date(),
  });

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

  const undoRound = () => {

    deleteRound(gameData.id, countRounds());

    // FIXME handle error

    setGameData(
      produce(game => {
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].rounds.pop();
        }
      }
      ));
  }

  const handleDelete = async () => {
    const success = deleteGame(gameData.id);
    if (success) {
      navigate("/");
    }
  }

  const handleNewRound = (e) => {
    e.preventDefault();

    const round = gameData.players.map((player, index) => {
      return Number.parseInt(e.target[index].value) || 0;
    });

    const ids = [];
    round.forEach((round, index) => {
      const id = createRound(gameData.id, countRounds() + 1, index, round);
      ids.push(id);
    });

    // FIXME assumes success, need to handle DB errors

    const before = totals();
    setGameData(
      produce(game => {
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].rounds.push(round[i]);
        }
      }
      ));
    playAudio(before, totals());
    
    // FIXME modify CSS class per daisy docs
    document.getElementById('new_round_modal').close();
    e.target.reset();
  };

  const handleGameSettings = (e) => {
    e.preventDefault();
    const title = e.target["new-title"].value || "";
    const endScore = Number.parseInt(e.target["new-max-score"].value);
    const valid = gameData.players.every(player => {
      return total(player.name) <= endScore;
    }) && title.length > 0;
    if (valid) {
      updateGame(gameData.id, title, endScore);
      // FIXME assumes success, need to handle DB errors
      setGameData('maxScore', endScore);
      setGameData('title', title);
    }
    // FIXME modify CSS class per daisy docs
    document.getElementById('title_modal').close();
  }


  // Memo to reverse rounds reactively
  const reversedRounds = createMemo(() => {
    const rounds = gameData.players[0]?.rounds.length || 0;
    return Array.from({ length: rounds }, (_, i) => i).reverse();
  });

  // Memo to sort players by total score
  const leaders = createMemo(() => {
    return [...gameData.players].sort(
      (a, b) => total(a.name) - total(b.name)
    )
  });

  const countRounds = createMemo(() => {
    // FIXME assumes equal length
    return gameData.players.length > 0 ? gameData.players[0].rounds.length : 0;
  });

  // Memo to compute the biggest loser
  const biggestLoser = createMemo(() => {
    if (countRounds() === 0) return undefined;

    const lastRound = gameData.players.map((player) => player.rounds[player.rounds.length - 1]);
    // FIXME break a tie (for now it's the first player)
    const loserIndex = lastRound.indexOf(Math.max(...lastRound));
    const loserPlayer = gameData.players[loserIndex];
    return {
      name: loserPlayer.name,
      score: lastRound[loserIndex],
      round: loserPlayer.rounds.length,
    };
  });

  const total = (playerName): number => {
    const player = gameData.players.find((p) => p.name === playerName);
    if (!player) return 0;
    return player.rounds.reduce((tot, score) => tot + score, 0);
  };

  const totals = (): number[] => {
    return gameData.players.map(p => total(p.name));
  }

  // ring bell if any total crossed the next multiple of 100
  const playAudio = (before: number[], after: number[]) => {
    const threshold = Math.min(Math.floor(Math.max(...before) / 100) * 100 + 100, gameData.maxScore);
    const crossed = after.some(total => total >= threshold);
    console.log(`Checking audio before=${before} threshold=${threshold} crossed=${crossed}`);
    if (crossed) {
        audio.play();
    }
}

  return (
    <div class="flex justify-center min-h-screen">
      <Show when={!loading()} fallback={<LoadingIndicator />}>
        <div class="w-96 px-4 mb-8">
          {/* Header */}
          <div class="flex justify-between items-center">
            <div class="flex flex-col">
              <div class="badge badge-secondary badge-outline text-xs">Tens</div>
              <h2 class="text-xl mt-2">{gameData.title}</h2>
              <div class="text-sm text-neutral-500">{gameData.createdAt.toDateString()}</div>
            </div>
            <div>
              <button class="btn btn-square btn-ghost" onclick="title_modal.showModal()">
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
            <dialog id="title_modal" class="modal modal-bottom sm:modal-middle">
              <div class="modal-box">
                <form method="dialog">
                  <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="text-lg font-bold">Game Settings</h3>
                <form onSubmit={handleGameSettings}>
                  <div class="flex flex-col pb-4">
                    <label class="text-lg mt-4 pb-2">Description</label>
                    <input
                      value={gameData.title}
                      id="new-title"
                      name="new-title"
                      class="input input-bordered" />
                    <label class="text-lg mt-8 pb-2">End Score</label>
                    <input
                      type="number"
                      value={gameData.maxScore}
                      id="new-max-score"
                      name="new-max-score"
                      class="input input-bordered w-1/4" />
                  </div>
                  <div class="flex flex-row justify-between mt-4">
                    <button class="btn btn-primary" type="submit">Save</button>
                    <button class="btn" onclick="delete_game_modal.showModal()">
                      <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                      </svg>
                      Delete Game
                    </button>
                    <ConfirmationDialog modalId="delete_game_modal" message="Delete this game?" action="Delete" callback={handleDelete} />
                  </div>
                </form>
              </div>
            </dialog>
          </div>

          {/* Stats */}
          <Show when={gameData.players.length > 0}>
            <div class="stats shadow my-2 w-full">
              <div class="stat">
                <div class="stat-title">Rounds Played</div>
                <div class="stat-value">{countRounds()}
                  <span class="px-2" />
                  <button class="btn btn-square btn-sm btn-primary" onClick="new_round_modal.showModal()">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7 7V5" />
                    </svg>
                  </button>
                </div>
              </div>
              <Show when={countRounds() > 0}>
                <div class="stat">
                  <div class="stat-title">Biggest Loser</div>
                  <div class="stat-value">{biggestLoser().name}</div>
                  <div class="stat-desc">
                    {biggestLoser().score} points in Round{' '}
                    {biggestLoser().round}
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          <dialog id="new_round_modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
              <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <form onSubmit={handleNewRound}>
                <h3 class="text-lg font-bold">Round {countRounds() + 1}</h3>
                <Index each={gameData.players}>{(player) => (
                  <div class="grid grid-cols-2 items-center mt-4">
                    <label class="text-lg">{player().name}</label>
                    <input
                      type="number"
                      placeholder="0"
                      id={"new-round-" + player().name}
                      name={"new-round-" + player().name}
                      class="input input-bordered" />
                  </div>
                )}
                </Index>
                <button class="btn btn-primary mt-4" type="submit">Add Round</button>
              </form>
            </div>
          </dialog>

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
                        (100 * total(player.name)) / gameData.maxScore,
                    }}
                    role="progressbar">
                    <span class="text-xl font-extrabold">
                      {total(player.name)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            </For>
          </div>

          {/* Round Table */}
          <Show when={countRounds() > 0}>
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
                            <div class="text-xs mt-1">{player.name}</div>
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
                              <button class="btn btn-xs" onClick="delete_round_modal.showModal()">
                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                </svg>
                              </button>
                              <ConfirmationDialog modalId="delete_round_modal" message={`Delete Round ${countRounds()}?`} action="Delete" callback={undoRound} />
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
