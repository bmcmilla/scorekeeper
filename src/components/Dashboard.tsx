import { Component, createResource, For, Show, Suspense } from "solid-js";
import { supabase } from "../api/SupabaseClient";
import { useNavigate } from "@solidjs/router";
import { User } from "@supabase/supabase-js";
import { getGames } from "../api/GameClient";
import NewGame from "./NewGame";
import LoadingIndicator from "./LoadingIndicator";
import { GameMetadata } from "../api/Model";

/** TODO
 * Error state (games not found)
 * Check valid new game form
 * Use context to reuse auth user
*/
const Dashboard: Component = () => {

    const navigate = useNavigate();

    // Create a resource for fetching user data
    const [user] = createResource<User>(async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            navigate("/login");
            return null;
        }
        return data.user;
    });

    // Create a resource for fetching game data
    const [games] = createResource<GameMetadata[]>(async () => {
        return await getGames();
    });

    const handleSignOut = () => {
        supabase.auth.signOut();
        navigate("/login");
    }

    return (
        <div class="flex flex-col justify-center items-center m-8">
            <Suspense fallback={<LoadingIndicator />}>
                <h3>Welcome, {user()?.user_metadata.display_name || user()?.user_metadata.name || 'anonymous'}!</h3>
                <div class="link link-primary link-hover"><a onClick={handleSignOut}>Sign out</a></div>
                <button class="btn btn-primary mt-6" onClick={() => (document.getElementById("new_game_modal") as HTMLFormElement).showModal()}>New Game</button>
                <NewGame id="new_game_modal" />
                <div class="mt-8">
                    <h3 class="font-bold pb-4">Saved Games</h3>
                    <Show when={games()?.length > 0} fallback={<h2>You haven't saved any games yet.</h2>}>
                        <div class="flex flex-col space-y-4">
                            <For each={games().toReversed()}>
                                {(game) => (
                                    <div class="flex flex-col">
                                        <div><a class="link" href={`/game/${game.id}`}>{game.title}</a></div>
                                        <div class="text-sm">{game.createdAt.toDateString()}</div>
                                    </div>
                                )}
                            </For>
                        </div>
                    </Show>
                </div>
            </Suspense>
        </div >
    )
}

export default Dashboard