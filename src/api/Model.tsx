
export type GamePlayer = {
    name: string,
    seatPosition: number,
    scores: number[]
}

export type Game = {
    title: string,
    players: GamePlayer[]
}