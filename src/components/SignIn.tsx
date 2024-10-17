import { Component } from "solid-js";
import GoogleOneTap from "./GoogleOneTap";

const SignIn : Component = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCredentialResponse = (params) => {
        console.log(params);
    }

    return (
        <div class="flex flex-col items-center m-8 h-dvh">
            Hello!
            <GoogleOneTap />
        </div>
    )
}

export default SignIn