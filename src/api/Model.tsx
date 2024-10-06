
export type Game = {
    title: string,
    maxScore: number,
    players: {
        name: string,
        rounds: number[]
    }[]
}