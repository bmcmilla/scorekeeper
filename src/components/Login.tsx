import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { supabase } from "../api/SupabaseClient";

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


    const handleGoogleSignIn = async () => {
        navigate("/signin");
    };

    return (
        <div class="flex flex-col items-center m-8 h-dvh">
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
                    <button
                        class="btn btn-primary"
                        type="button"
                        onClick={handleGoogleSignIn}>
                        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd" />
                        </svg>
                        Sign In with Google
                    </button>
                </div>
                <div>
                    <span class="text-xs">
                        Don't have an account? <A href="/register" class="text-blue-600 dark:text-blue-500 hover:underline">Sign up here</A>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default Login