import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { supabase } from "../api/SupabaseClient";
import SignIn from "./GoogleSignIn";

const Login: Component = () => {

    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const navigate = useNavigate();

    // FIXME needs cleanup
    supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            navigate("/");
        }
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email: email(), password: password() });
            if (error) throw error;
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    return (
        <div class="flex flex-col items-center m-8">
            <form>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input
                        class="input input-bordered w-80"
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        class="input input-bordered w-80"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="flex flex-row mb-4 space-x-4">
                    <button
                        class="btn btn-primary"
                        type="button"
                        onClick={handleLogin}>
                        Sign In
                    </button>
                    <div class="divider divider-horizontal">OR</div>
                    <SignIn />                                            
                </div>
                <div>
                    <span class="text-xs">
                        Don't have an account? <A href="/register" class="link-hover link-primary">Sign up here</A>
                    </span>
                </div>                
            </form>    
        </div>
    )
}

export default Login