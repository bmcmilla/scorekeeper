
export type Game = {
    id: number,
    title: string,
    maxScore: number,
    createdAt: Date,
    players: {
        name: string,
        rounds: number[]
    }[]
}