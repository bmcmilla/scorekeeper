import { Component, createSignal, onCleanup, onMount, Show } from "solid-js";
// import { supabase } from "../api/SupabaseClient";
// import { useNavigate } from "@solidjs/router";

const SignIn: Component = () => {

    // const navigate = useNavigate();

    const [scriptLoaded, setScriptLoaded] = createSignal(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function handleCredentialResponse(response) {

        console.log(response);

        // const { data, error } = await supabase.auth.signInWithIdToken({
        //     provider: 'google',
        //     token: response.credential,
        // });

        // if (!error) {
        //     console.log(data);
        //     navigate("/dashboard")
        // }

        // console.log(error);
    }

    onMount(() => {
        const script = document.createElement("script") as HTMLScriptElement;
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true;
        script.onload = () => {
            setScriptLoaded(true);
        }
        document.head.appendChild(script);
    });

    onCleanup(() => {
        console.log("Cleaned up");
        // unload script?
    });

    return (
        <div class="flex flex-col items-center m-8 h-dvh">
            <div id="g_id_onload"
                data-client_id="320191205718-uisumpne4juup798ts2c3lts18f0gngq.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback={handleCredentialResponse}
                data-itp_support="true">
            </div>
            <div class="g_id_signin"
                data-type="standard"
                data-shape="rectangular"
                data-theme="filled_black"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left">
            </div>
            <Show when={scriptLoaded()}>
                <p>Script loaded!</p>
            </Show>
        </div>
    )
}

export default SignIn