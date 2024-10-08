import { useNavigate } from "@solidjs/router";
import { createSignal, Index, Show } from "solid-js";
import { createGame } from "../api/GameClient";

const NewGame = () => {

    const navigate = useNavigate();

    const DEFAULT_PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3', 'Player 4'];

    const [players, setPlayers] = createSignal(DEFAULT_PLAYER_NAMES);

    const onSubmit = async () => {
        const id = await createGame();
        if (id) {
            navigate(`/game/${id}`);
        }
        // FIXME handle error
    };

    const addPlayer = () => {
        const arr = [...players()];
        arr.push('Player ' + (arr.length + 1));
        setPlayers(arr);
    }

    const removePlayer = () => {
        const arr = [...players()];
        arr.pop();
        setPlayers(arr);
    }

    return (
        <div>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-lg font-bold pb-4">New Game</h3>
            <label class="mt-4">Who's playing?</label>
            <Index each={players()}>
                {(player, index) => (
                    <div class="py-2">
                        <div class="flex flex-row items-center">
                            <div class="text-lg font-bold px-4">{index + 1}</div>
                            <input type="text" placeholder={DEFAULT_PLAYER_NAMES[index]} class="input input-bordered w-64" />
                            <Show when={index === players().length - 1}>
                                <div class="flex flex-row items-center">
                                    <div>
                                        <button class="btn btn-circle btn-sm btn-info" onClick={addPlayer}>
                                            <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <Show when={players().length > 1}>
                                        <div class="px-2 ">
                                            <button class="btn btn-circle btn-sm btn-secondary" onClick={removePlayer}>
                                                <svg class="w-2 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </Show>
                                </div>
                            </Show>
                        </div>
                    </div>
                )}
            </Index>
            <div class="my-4">
                <button class="btn btn-primary" onClick={onSubmit}>Start</button>
            </div>
        </div>
    )
}

export default NewGame