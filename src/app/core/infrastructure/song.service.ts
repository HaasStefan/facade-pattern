import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, share } from 'rxjs';
import { Song } from '../entities/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private readonly songs$!: Observable<Song[]>;

  constructor(private readonly http: HttpClient) {
    this.songs$ = this.http.get<Song[]>('/assets/songs.json').pipe(
      share({
        connector: () => new ReplaySubject(),
      })
    );
  }

  get(id: number): Observable<Song | null> {
    return this.songs$.pipe(
      map(songs => {
        const song = songs.find(s => s.id === id);
        return song ?? null;
      })
    );
  }
}
