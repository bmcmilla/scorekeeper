import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

const Login = () => {

    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');

    return (
        <>
            <form>
                <div class="grid grid-cols-1">
                    <h3>Login</h3>
                    <label>Email</label>
                    <input
                        class="input input-bordered w-full max-w-xs"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)} />
                    <label>Password</label>
                    <input
                        class="input input-bordered w-full max-w-xs"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)} />
                    <button class="btn" type="submit">Login</button>
                    <span>
                        Don't have an account? <A href="/register">Register here</A>
                    </span>
                </div>
            </form>
        </>
    )
}

export default Login