import { Component, onCleanup, onMount } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";

const SignIn: Component = () => {

    const navigate = useNavigate();

    async function handleCredentialResponse(response) {

        if (response.credential) {
            const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });

            if (!error) {
                navigate("/")
            } else {
                console.log(error);
            }
        } else {
            navigate("/login");
        }
    }

    onMount(() => {
        const script = document.createElement("script") as HTMLScriptElement;
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.onload = () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                cancel_on_tap_outside: false,
                callback: (response) => {
                    handleCredentialResponse(response);
                }
            });
        }
        document.head.appendChild(script);
    });

    onCleanup(() => {
        // FIXME unload script?
    });

    const handleGoogleSignIn = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error                   
            window.google.accounts.id.prompt();
        } catch (err) {
            console.error("Google prompt error", err);
        }
    };

    return (
        <button
            class="btn btn-primary"
            type="button"
            onClick={handleGoogleSignIn}>
            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd" />
            </svg>
            Sign In with Google
        </button>
    )
}

export default SignIn