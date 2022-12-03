
export interface User {
    id: number,
    email: string,
    favourites: {
        pizzaId: number,
        songId: number
    }
}