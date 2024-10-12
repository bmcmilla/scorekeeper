import { A } from "@solidjs/router";

const Navbar = () => {

    return (
        <div class="navbar bg-base-100">
            <div class="navbar-start">
                <A class="text-xl font-extralight" href="/">Scorekeeper</A>
            </div>
        </div>
    )
}

export default Navbar