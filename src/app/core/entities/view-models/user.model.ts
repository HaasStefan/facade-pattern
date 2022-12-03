import { Pizza } from "../pizza.model"
import { Song } from "../song.model"

export interface User {
    id: number,
    email: string,
    favourites: {
        pizza: Pizza | null
        song: Song | null
    }
}