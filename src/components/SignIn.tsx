import { Component, onCleanup, onMount } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import LoadingIndicator from "./LoadingIndicator";

const SignIn: Component = () => {

    const navigate = useNavigate();

    async function handleCredentialResponse(response) {

        const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: response.credential,
        });

        if (!error) {
            navigate("/")
        } else {
            console.log(error);
        }
    }

    onMount(() => {
        const script = document.createElement("script") as HTMLScriptElement;
        script.src = "https://accounts.google.com/gsi/client";
        // FIXME disable in production?
        script.referrerPolicy = "no-referrer-when-downgrade";
        script.async = true;
        script.onload = () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: (response) => {
                    handleCredentialResponse(response);
                }
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error   
            window.google.accounts.id.prompt();
        }
        document.head.appendChild(script);
    });

    onCleanup(() => {
        // FIXME unload script?
    });

    return (
        <div class="flex flex-col items-center m-8 h-dvh">
            <LoadingIndicator />
        </div>
    )
}

export default SignIn