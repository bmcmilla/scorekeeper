import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { supabase } from "../api/SupabaseClient";

const Register = () => {

    const [displayName, setDisplayName] = createSignal('');
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signUp({
                email: email(),
                password: password(),
                options: { 
                    data: { 
                        display_name: displayName()
                    }
                }
            });
            if (error) throw error;
            navigate("/");
        } catch (error) {
            alert(error.error_description || error.message);
        }
    };

    return (
        <div class="w-full m-8">
            <form class="flex flex-col justify-center items-center m-8">
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="displayName">
                        Name
                    </label>
                    <input
                        class="input input-bordered w-96"
                        type="displayName"
                        name="displayName"
                        onChange={(e) => setDisplayName(e.target.value)} />
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input
                        class="input input-bordered w-96"
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        class="input input-bordered w-96"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="mb-4">
                    <button
                        class="btn btn-primary"
                        type="button"
                        onClick={handleRegister}>
                        Sign Up
                    </button>
                </div>
                <div>
                    <span class="text-xs">
                        Already have an account? <A href="/login" class="text-blue-600 dark:text-blue-500 hover:underline">Sign in here</A>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default Register