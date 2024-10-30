import { useNavigate } from "@solidjs/router";
import { Component, Index, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { createGame } from "../api/GameClient";

const NewGame: Component<{ id: string }> = (props) => {

    const navigate = useNavigate();

    const [players, setPlayers] = createStore(['', '', '', '']);

    const onSubmit = async () => {
        const arr = players.map((player, index) => player || playerPlaceholder(index));
        const id = await createGame(arr);
        if (id) {
            navigate(`/game/${id}`);
        }
        // FIXME handle error
    };

    const addPlayer = () => {
        setPlayers(players.length, playerPlaceholder(players.length));
    }

    const removePlayer = () => {
        const arr = [...players];
        arr.pop();
        setPlayers(arr);
    }

    const handleInput = (e: InputEvent) => {
        const { name, value } = e.currentTarget as HTMLInputElement;
        const index = parseInt(name.split('-')[1])
        setPlayers(index, value);
    }

    const playerPlaceholder = (forIndex: number): string => {
        return "Player " + (forIndex + 1);
    }

    return (
        <dialog id={props.id} class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <form method="dialog">
                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 class="text-lg font-bold pb-4">New Game</h3>
                <p class="pb-4">Who's playing?</p>
                <Index each={players}>
                    {(player, index) => (
                        <div class="py-2">
                            <div class="flex flex-row items-center px-4">
                                <label class="text-lg font-bold px-4 w-12">{index + 1}</label>
                                <input type="text" placeholder={playerPlaceholder(index)} class="input input-bordered" name={"player-" + index} id={"player-" + index} oninput={handleInput} />
                                <Show when={index === players.length - 1} fallback={<></>}>
                                    <div class="flex flex-row items-center">
                                        <div class="ml-4">
                                            <button class="btn btn-circle btn-sm" onClick={addPlayer}>
                                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <Show when={players.length > 1}>
                                            <div class="px-2">
                                                <button class="btn btn-circle btn-sm" onClick={removePlayer}>
                                                    <svg class="w-2 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
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
        </dialog>
    )
}

export default NewGame