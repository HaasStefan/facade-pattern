import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  combineLatest,
  combineLatestAll,
  map,
  mergeMap,
  Observable,
  pipe,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { User } from '../entities/view-models/user.model';
import { User as UserStateModel } from '../entities/state-models/user.model';
import { PizzaService } from '../infrastructure/pizza.service';
import { SongService } from '../infrastructure/song.service';
import { UserService } from '../infrastructure/user.service';

interface State {
  selectedUser: User | null;
  users: User[];
}

@Injectable({
  providedIn: 'root',
})
export class FacadeService extends ComponentStore<State> {
  readonly selectedUser$ = this.select(({ users, selectedUser }) =>
    users.find((u) => u.id === selectedUser?.id)
  );

  readonly users$ = this.select(({ users }) => users);

  readonly selectUser = this.updater((state: State, user: User) => ({
    ...state,
    selectedUser: user,
  }));

  readonly loadUsers = this.effect<void>(
    pipe(
      switchMap(() =>
        this.getUsers().pipe(
          tapResponse((users) => this.patchState({ users }), console.error)
        )
      )
    )
  );

  constructor(
    private readonly userService: UserService,
    private readonly pizzaService: PizzaService,
    private readonly songService: SongService
  ) {
    super({
      selectedUser: null,
      users: [],
    });
  }

  private getUsers(): Observable<User[]> {
    return this.userService.getAll().pipe(
      mergeMap((users) => users.map((u) => this.getUser(u))),
      combineLatestAll()
    );
  }

  private getUser(user: UserStateModel | null): Observable<User> {
    if (!user) return throwError(() => new Error('user not found'));

    return combineLatest({
      pizza: this.pizzaService.get(user.favourites.pizzaId),
      song: this.songService.get(user.favourites.songId),
    }).pipe(
      map(
        ({ pizza, song }) =>
          ({
            id: user.id,
            email: user.email,
            favourites: {
              pizza,
              song,
            },
          } as User)
      )
    );
  }
}
