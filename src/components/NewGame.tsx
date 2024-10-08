import { useNavigate } from "@solidjs/router";
import { createSignal, Index } from "solid-js";
import { createGame } from "../api/GameClient";

const NewGame = () => {

    const navigate = useNavigate();

    const [players, setPlayers] = createSignal([]);

    const onSubmit = async () => {
        const id = await createGame();
        if (id) {
            navigate(`/game/${id}`);
        }
    };

    setPlayers(['Player 1', 'Player 2', 'Player 3', 'Player 4'])

    return (
        <div>
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-lg font-bold">New Game</h3>
            <p class="py-4">Who's playing?</p>
            <Index each={players()}>
                {(player) => (
                    <div>
                        {player()}
                    </div>
                )}
            </Index>
            <div class="my-4"><button class="btn btn-primary" onClick={onSubmit}>Start</button></div>
        </div>
    )
}

export default NewGame