import { Game } from "./Model";
import { supabase } from "./SupabaseClient";

export async function createGame(): Promise<number> {

    const { data, error } = await supabase.from('games').insert({
        title: generateTitle(new Date()),
        max_score: 500
    }).select();

    if (!error) {
        return data[0].game_id;
    }

    console.error(error.message);
    return 0;
}

export async function getGames(): Promise<{ id: number, title: string }[]> {

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

export async function countRounds(id: number): Promise<number> {
    const { data, error } = await supabase.from('scores')
        .select(`*, cities(count)`)
        .eq('game_id', id)

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
        id: input[0].game_id,
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

function generateTitle(now: Date): string {

    // Get the current day of the week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[now.getDay()];

    // Get the current hour
    const hour = now.getHours();

    // Determine if it's morning, afternoon, or evening
    let timeOfDay;
    if (hour >= 5 && hour < 12) {
        timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
        timeOfDay = 'afternoon';
    } else {
        timeOfDay = 'evening';
    }

    // Construct the string
    return `${day} ${timeOfDay} game`;
}


