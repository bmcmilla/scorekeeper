import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

const Register = () => {

    const [email, setEmail] = createSignal(''); // email of the user
    const [password, setPassword] = createSignal(''); // password of the user

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
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input
                        class="input input-bordered"
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div class="flex items-center">
                    <button class="btn btn-primary" type="button">
                        Sign In
                    </button>
                </div>
                <span class="py-8 text-xs">
                    Already have an account? <A href="/login">Login here</A>
                </span>
            </form>
        </div>
    )
}

export default Register