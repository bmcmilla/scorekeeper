import { createSignal } from "solid-js";

const Dashboard = () => {

    const [user, setUser] = createSignal({});

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <h4 class="mb-6">Welcome, User</h4>
            <button type="button" class="btn btn-primary">Sign Out</button>
        </div>
    )
}

export default Dashboard