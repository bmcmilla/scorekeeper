import { createSignal } from "solid-js";

const Dashboard = () => {
    
    // user details
    const [user, setUser] = createSignal({}); 
    
    return (
       <div class="dashboard-section">
            <div class="user-detail">
                <h3>Dashboard</h3>
                <h4>Welcome, User</h4>
                <button type="button" class="btn">Log out</button>
            </div>
        </div>
    )
}

export default Dashboard