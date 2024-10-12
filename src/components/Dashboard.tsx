import { createSignal, For, onMount, Show } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";
import { getGames } from "../api/GameClient";
import { GameMetadata } from "../api/Model";
import NewGame from "./NewGame";
import LoadingIndicator from "./LoadingIndicator";

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

    const handleSignOut = () => {
        supabase.auth.signOut();
        navigate("/login");
    }    

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <Show when={!loading()} fallback={<LoadingIndicator/>}>
                <h4>Bem-vindo, {user().user_metadata.display_name ? user().user_metadata.display_name : 'anonymous'}!</h4>
                <div class="text-sm link-primary"><a onClick={handleSignOut}>Sign out</a></div>
                <button class="btn btn-primary mt-6" onClick="new_game_modal.showModal()">New Game</button>
                <dialog id="new_game_modal" class="modal modal-bottom sm:modal-middle">
                    <div class="modal-box">
                        <NewGame />
                    </div>
                </dialog>
                <div class="mt-8">
                    <h3 class="text-lg font-bold pb-4">Previous Games</h3>
                    <Show when={games().length > 0} fallback={<h2>No games available.</h2>}>
                        <div class="flex flex-col space-y-4">
                            <For each={games().toReversed()}>
                                {(game) => (
                                    <div class="flex flex-col">
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