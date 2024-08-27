import { createSignal, For, onMount, Show } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {

    type Game = { title: string };

    const [user, setUser] = createSignal<User>();
    const [loading, setLoading] = createSignal(true);
    const [games, setGames] = createSignal<Game[]>();
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
            setLoading(false);
        } else {
            navigate("/login");
        }

        const { data, error } = await supabase
            .from('games')
            .select();
        if (!error) {
            setGames(data.map(item => {
                return { title: item.title }
            }));
        } else {
            console.log(error);
        }

        tryAll();

    });

    const tryAll = async () => {
        let { data, error } = await supabase.from('scores').select(`
            score,
            players(player_name, seat_position),
            rounds(seq_num)
          `).order('seq_num', { referencedTable: 'rounds' })
            .order('seat_position', { referencedTable: 'players' })
        console.log(data);
    }

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
                    <For each={games()}>{(game, i) =>
                        <li>
                            {game.title}
                        </li>
                    }</For>
                </div>
            </Show>
        </div>
    )
}

export default Dashboard