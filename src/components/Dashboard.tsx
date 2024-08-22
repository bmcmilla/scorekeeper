import { createSignal } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";

const Dashboard = () => {

    const [user, setUser] = createSignal({});
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <h4 class="mb-6">Welcome, User</h4>
            <button
                type="button"
                class="btn btn-primary" onClick={handleSignOut}>
                    Sign Out
            </button>
        </div>
    )
}

export default Dashboard