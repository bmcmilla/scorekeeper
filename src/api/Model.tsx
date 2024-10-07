
export type Game = {
    title: string,
    maxScore: number,
    createdAt: Date,
    players: {
        name: string,
        rounds: number[]
    }[]
}