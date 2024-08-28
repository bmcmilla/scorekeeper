import { Game } from "./Model";
import { supabase } from "./SupabaseClient";

export async function getGame(id: number): Promise<Game> {

    const { data, error } = await supabase.from('scores').select(`
        score,
        players(player_name, seat_position, games(title, game_id))
      `)
        .eq('players.games.game_id', id)
        .order('players(seat_position)')

    if (error) {
        console.error(error.message);
        return undefined;
    }

    return transformToGameObject(data);
}

export function transformToGameObject(input): Game {

    // Extract the game title from the first entry
    const title = input[0].players.games.title;

    // Create a map to store players and their scores
    const playersMap = new Map();

    input.forEach(entry => {
        const { player_name, seat_position } = entry.players;
        const { score } = entry;

        if (!playersMap.has(player_name)) {
            playersMap.set(player_name, {
                name: player_name,
                seatPosition: seat_position,
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

// type RoundsByPlayer = {
//     [key: string]: { rounds: number[] }
// };
// const roundsByPlayer = {} as RoundsByPlayer;

// data.forEach(item => {

//     const playerName = item.players.player_name;
//     const seatPosition = item.players.seat_position;
//     const score = item.score;

//     if (!roundsByPlayer[playerName]) {
//         roundsByPlayer[playerName] = {
//             rounds: []
//         }
//     }

//     players[playerName].rounds.push(score);
// });

// // Convert the map to an array and ensure each player has a complete rounds array
// game.players = Object.values(players);

