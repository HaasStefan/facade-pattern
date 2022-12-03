import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, share } from 'rxjs';
import { User } from '../entities/state-models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly users$!: Observable<User[]>;

  constructor(private readonly http: HttpClient) {
    this.users$ = this.http.get<User[]>('/assets/users.json').pipe(
      share({
        connector: () => new ReplaySubject(),
      })
    );
  }

  get(id: number): Observable<User | null> {
    return this.users$.pipe(
      map(users => {
        const user = users.find(u => u.id === id);
        return user ?? null;
      })
    );
  }

  getAll(): Observable<User[]> {
    return this.users$;
  }
}
