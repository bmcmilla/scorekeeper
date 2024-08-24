import { createSignal, onMount, Show } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {

    const [user, setUser] = createSignal<User>();
    const [loading, setLoading] = createSignal(true);
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
            </Show>
        </div>
    )
}

export default Dashboard