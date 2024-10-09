import { A, useNavigate } from "@solidjs/router";
import { supabase } from "../api/SupabaseClient";

const Navbar = () => {

    const navigate = useNavigate();

    const handleSignOut = () => {
        supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <div class="navbar bg-base-100">
            <div class="navbar-start">
                <A class="text-xl font-extralight" href="/">Scorekeeper</A>
            </div>
            <div class="navbar-end">
                <a class="btn btn-ghost btn-sm" onClick={handleSignOut}>Sign Out</a>
            </div>
        </div>
    )
}

export default Navbar