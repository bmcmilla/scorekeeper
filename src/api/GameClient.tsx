import { Game } from "./Model";
import { supabase } from "./SupabaseClient";

export async function getGames(): Promise<{id: number, title: string}[]> {

    const { data, error } = await supabase.from('games').select(`
        game_id,
        title,
        created_at
      `).order('created_at');

    if (!error) {
        return data.map((item) => {
            return {
                id: item.game_id,
                title: item.title
            }
        });
    }

    console.error(error.message);
    return [];
}

export async function getGame(id: number): Promise<Game> {

    const { data, error } = await supabase.from('scores').select(`
        score,
        player_index,
        games(title, players, game_id))
      `)
        .eq('games.game_id', id)
        .order('player_index')

    if (!error) {
        return transformToGameObject(data);
    }

    console.error(error.message);
    return undefined;
}

export function transformToGameObject(input): Game {

    if (!input[0]) {
        return;
    }

    // Extract the game title from the first entry
    const title = input[0].games.title;

    // Create a map to store players and their scores
    const playersMap = new Map();

    input.forEach(entry => {
        const player_name = entry.games.players[entry.player_index];
        const score  = entry.score;

        if (!playersMap.has(player_name)) {
            playersMap.set(player_name, {
                name: player_name,
                scores: []
            });
        }

        // Append the score to the player's scores array
        playersMap.get(player_name).scores.push(score);
    });

    // Convert the players map to an array
    const players = Array.from(playersMap.values());

    return {
        title,
        players
    };
}


