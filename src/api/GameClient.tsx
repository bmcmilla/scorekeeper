import { Game, GameMetadata } from "./Model";
import { supabase } from "./SupabaseClient";

export async function createGame(players: string[]): Promise<number> {

    const { data, error } = await supabase.from('games').insert({
        title: generateTitle(new Date()),
        max_score: 500,
        players: players
    }).select();

    if (!error) {
        return data[0].game_id;
    }

    console.error(error.message);
    return 0;
}

export async function getGames(): Promise<GameMetadata[]> {

    const { data, error } = await supabase.from('games').select(`
        game_id,
        title,
        created_at
      `).order('created_at');

    if (!error) {
        return data.map((item) => {
            return {
                id: item.game_id,
                title: item.title,
                createdAt: new Date(item.created_at)
            }
        });
    }

    console.error(error.message);
    return [];
}

export async function getGame(id: number): Promise<Game> {

    const { data, error } = await supabase.from('games').select(`
        game_id,
        title,
        players,
        max_score,
        created_at,
        players,
        scores(player_index, round_num, score))
      `)
        .eq('game_id', id)
        .order('round_num', { referencedTable: 'scores', ascending: true })
        .order('player_index', { referencedTable: 'scores', ascending: true })

    if (!error) {
        return transformToGameObject(data);
    }

    console.error(error.message);
    return undefined;
}

export function transformToGameObject(input): Game {

    const data = input && input.length > 0 ? input[0] : undefined;

    if (!data) {
        return;
    }

    const result = {
        id: data.game_id,
        title: data.title,
        maxScore: data.max_score,
        createdAt: new Date(data.created_at),
        players: data.players.map(player => {
            return {
                name: player,
                rounds: []
            }
        })
    };

    if (data.scores) {
        data.scores.forEach(row => {
            result.players[row.player_index].rounds.push(row.score);
        });
    }

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


