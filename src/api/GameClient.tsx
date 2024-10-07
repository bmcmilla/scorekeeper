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
        game_id,
        score,
        player_index,
        games(title, players, max_score, created_at))
      `)
        .eq('game_id', id)
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

    const result = {
        title: input[0].games.title,
        maxScore: input[0].games.max_score,
        createdAt: new Date(input[0].games.created_at),
        players: input[0].games.players.map(name => {
            return {
                name: name,
                rounds: []
            }
        })
    };

    input.forEach(entry => {
        result.players[entry.player_index].rounds.push(entry.score);
    });
    
    return result;
}


