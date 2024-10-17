import { readFileSync } from 'fs';
import { join } from 'path';

// Load and parse the input data from input.json
const inputFilePath = join('/Users/barrymc/Workspace/scorekeeper/supabase', 'history.json');
const games = JSON.parse(readFileSync(inputFilePath, 'utf-8'));

const keys = Object.keys(games);

const uid = 'b2473443-8762-47c5-9517-747aeddd945d';

const script = [];

script.push('DELETE FROM games;');

keys.forEach((key, index) => {
    const game = games[key];
    const sql = `INSERT INTO games (game_id, title, max_score, players, user_id, created_at) VALUES (${index + 1}, '${key}', ${game.maxScore}, array[${game.players.map(p => "'" + p.name + "'").join(',')}], '${uid}', '${convertToTimetz(key)}');`;
    script.push(sql);
});

script.push('DELETE FROM scores;');

let id = 1;
keys.forEach((key, gameIndex) => {
    const game = games[key];
    for (let playerIndex = 0; playerIndex < Object.keys(game.players).length; playerIndex++) {
        const player = Object.values(game.players)[playerIndex];
        script.push(`-- ${player.name}`);
        for (let roundIndex = 0; roundIndex < player.rounds.length; roundIndex++) {
            const sql = `INSERT INTO scores (game_id, player_index, round_num, score, user_id) VALUES (${gameIndex + 1}, ${playerIndex}, ${roundIndex + 1}, ${player.rounds[roundIndex]}, '${uid}');`;
            script.push(sql);
        }
    }



    // players.forEach(player => {
    //     for (let index = 0; index < players.rounds.length; index++) {
    //         const element = array[index];

    //     }
    //     const sql = `INSERT INTO scores (score_id, game_id, round_num, player_index, score, user_id) VALUES \
    //     (${id++}, '${index + 1}', ${game.maxScore}, ${round++}[${game.players.map(p => "'" + p.name + "'").join(',')}], '${uid}', '${convertToTimetz(key)}');`;
    //     script.push(sql);
    // });
});

console.log(script.join('\n'));


function convertToTimetz(dateString) {

    // Parse the date string (assuming it's in the format "YYYY-MM-DD")
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    // exact time is not important
    const timetzString = `${year}-${month}-${day} 12:00:00+00`;

    return timetzString;
}







