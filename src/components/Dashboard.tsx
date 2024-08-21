import { createSignal } from "solid-js";

const Dashboard = () => {

    const [user, setUser] = createSignal({});

    return (
        <div class="m-8">
            <h4 class="mb-6">Welcome, User</h4>
            <button type="button" class="btn btn-primary">Sign Out</button>
        </div>
    )
}

export default Dashboard