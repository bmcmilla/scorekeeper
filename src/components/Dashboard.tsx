import { createSignal, Match, onMount, Show, Switch } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {

    const [user, setUser] = createSignal<User>();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
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
    });

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <h4 class="mb-6">Welcome, {user() ? user().email : 'nobody'}</h4>
            <button
                type="button"
                class="btn btn-primary" onClick={handleSignOut}>
                Sign Out
            </button>
        </div>
    )
}

export default Dashboard