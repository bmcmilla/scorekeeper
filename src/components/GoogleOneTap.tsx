import { Component } from "solid-js"

const GoogleOneTap: Component = () => {


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCredentialResponse = (params) => {
        console.log(params);
    }

    return (
        <>
            <div id="g_id_onload"
                data-client_id="320191205718-uisumpne4juup798ts2c3lts18f0gngq.apps.googleusercontent.com"
                data-context="signin"
                data-ux_mode="popup"
                data-callback="handleCredentialResponse"
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
        </>
    )
}

export default GoogleOneTap;