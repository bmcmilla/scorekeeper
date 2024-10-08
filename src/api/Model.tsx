
export type GameMetadata = {
    id: number,
    title: string,
    createdAt: Date
}

export type Game = GameMetadata & {
    maxScore: number,
    players: {
        name: string,
        rounds: number[]
    }[]
}