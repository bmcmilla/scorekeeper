import { createSignal, For, onMount, Show } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";
import { createGame, getGames } from "../api/GameClient";

const Dashboard = () => {

    const [user, setUser] = createSignal<User>();
    const [loading, setLoading] = createSignal(true);
    const [games, setGames] = createSignal<{ id: number, title: string }[]>();
    const navigate = useNavigate();

    const handleSignOut = () => {
        supabase.auth.signOut();
        handleSignIn();
    }

    const handleSignIn = () => {
        navigate("/login");
    }

    const handleNewGame = async () => {
        const id = await createGame();
        if (id) {
            navigate(`/game/${id}`);
        }
    }    

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
            <Show when={!loading()} fallback={<span class="loading loading-dots loading-lg"></span>}>
                <h4 class="mb-6">Bem-vindo, {user().user_metadata.display_name ? user().user_metadata.display_name : 'anonymous'}!</h4>
                <button
                    type="button"
                    class="btn btn-primary" onClick={handleSignOut}>
                    Sign Out
                </button>
                <div class="mt-8">
                    <h3>Games</h3>
                    <Show when={games().length > 0} fallback={<h2>No games available</h2>}>
                        <ul>
                            <For each={games()}>
                                {(game) => (
                                    <li><a class="link" href={`/game/${game.id}`}>{game.title}</a></li>
                                )}
                            </For>
                        </ul>
                    </Show>
                </div>
            </Show >

            <div class="my-4"><button class="btn btn-primary" onClick={handleNewGame}>New Game</button></div>            

        </div >
    )
}

export default Dashboard