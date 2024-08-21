import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

const Login = () => {

    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');

    return (
        <div class="w-full max-w-sm">
            <form class="m-8">
                <div class="mb-4">
                    <label class="block text-sm font-bold mb-2" for="email">
                        Email
                    </label>
                    <input
                        class="input input-bordered"
                        type="email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        class="input input-bordered"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="mb-4">
                    <button
                        class="btn btn-primary"
                        type="button">
                        Login
                    </button>
                </div>
                <div>
                    <span class="text-xs">
                        Don't have an account? <A href="/register">Register here</A>
                    </span>
                </div>
            </form>
        </div>
    )
}

export default Login