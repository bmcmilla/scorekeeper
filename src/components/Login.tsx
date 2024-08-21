import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

const Login = () => {

    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');

    return (
        <div class="w-full">
            <form class="flex flex-col justify-center items-center m-8">
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
                        type="button">
                        Sign In
                    </button>
                </div>
                <div>
                    <span class="text-xs">
                        Don't have an account? <A href="/register" class="text-blue-600 dark:text-blue-500 hover:underline">Register here</A>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default Login