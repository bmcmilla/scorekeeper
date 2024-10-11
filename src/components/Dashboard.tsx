import { createSignal, For, onMount, Show } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";
import { getGames } from "../api/GameClient";
import { GameMetadata } from "../api/Model";
import NewGame from "./NewGame";

const Dashboard = () => {

    const [user, setUser] = createSignal<User>();
    const [loading, setLoading] = createSignal(true);
    const [games, setGames] = createSignal<GameMetadata[]>();

    const navigate = useNavigate();

    onMount(async () => {
        const user = await supabase.auth.getUser();
        if (!user.error) {
            setUser(user.data.user);
        } else {
            navigate("/login");
        }

        const games = await getGames();
        if (games) {
            setGames(games);
        }

        setLoading(false);
    });

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <Show when={!loading()} fallback={<div class="loading loading-dots loading-lg h-dvh"></div>}>
                <h4 class="mb-6">Bem-vindo, {user().user_metadata.display_name ? user().user_metadata.display_name : 'anonymous'}!</h4>
                <button class="btn btn-primary" onClick="new_game_modal.showModal()">New Game</button>
                <dialog id="new_game_modal" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                        <NewGame />
                    </div>
                </dialog>
                <div class="mt-8">
                    <h3 class="text-lg font-bold">Saved Games</h3>
                    <Show when={games().length > 0} fallback={<h2>No games available</h2>}>
                        <div class="flex flex-col">
                            <For each={games().toReversed()}>
                                {(game) => (
                                    <div class="pt-2">
                                        <div><a class="link" href={`/game/${game.id}`}>{game.title}</a></div>
                                        <div class="text-sm">{game.createdAt.toDateString()}</div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </Show >
        </div >
    )
}

export default Dashboard