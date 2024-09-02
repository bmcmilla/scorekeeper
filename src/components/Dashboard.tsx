import { createSignal, For, onMount, Show } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";
import { getGame } from "../api/GameClient";
import { Game } from "../api/Model";

const Dashboard = () => {

    const [user, setUser] = createSignal<User>();
    const [loading, setLoading] = createSignal(true);
    const [game, setGame] = createSignal<Game>();
    const navigate = useNavigate();

    const handleSignOut = () => {
        supabase.auth.signOut();
        handleSignIn();
    }

    const handleSignIn = () => {
        navigate("/login");
    }

    onMount(async () => {
        const user = await supabase.auth.getUser();
        if (!user.error) {
            setUser(user.data.user);
        } else {
            navigate("/login");
        }

        const game = await getGame(1);
        if (game) {
            setGame(game);
        }

        setLoading(false);
    });

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <Show when={!loading()} fallback={<span class="loading loading-dots loading-lg"></span>}>
                <h4 class="mb-6">Bem-vindo, {user().user_metadata.display_name ? user().user_metadata.display_name : 'anonymous'}!</h4>
                <button
                    type="button"
                    class="btn btn-primary" onClick={handleSignOut}>
                    Sign Out
                </button>
                <div class="mt-8">
                    <h3>Games</h3>
                    <Show when={game()} fallback={<h2>No games available</h2>}>
                        <h2>{game().title}</h2>
                        <For each={game().players}>{(player) =>
                            <li>
                                {player.name}: {JSON.stringify(player.scores)}
                            </li>
                        }</For>
                    </Show>
                </div>
            </Show>
        </div>
    )
}

export default Dashboard