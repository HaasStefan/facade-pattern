import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  combineLatest,
  combineLatestAll,
  filter,
  map,
  mergeMap,
  Observable,
  of,
  pipe,
  switchMap,
  throwError,
} from 'rxjs';
import { User } from '../entities/view-models/user.model';
import { User as UserStateModel } from '../entities/state-models/user.model';
import { PizzaService } from '../infrastructure/pizza.service';
import { SongService } from '../infrastructure/song.service';
import { UserService } from '../infrastructure/user.service';

interface State {
  selectedUser: number;
  users: UserStateModel[];
}

@Injectable({
  providedIn: 'root',
})
export class FacadeService extends ComponentStore<State> {
  readonly selectedUser$ = this.select(({ users, selectedUser }) =>
    users.find((u) => u.id === selectedUser)
  ).pipe(
    filter(user => !!user),
    switchMap((user) =>
      user ? of(user).pipe(this.mapOneToViewModel()) : of(user)
    ),
  );

  readonly users$ = this.select(({ users }) => users).pipe(
    this.mapArrayToViewModel()
  );

  readonly selectUser = this.updater((state: State, user: User) => ({
    ...state,
    selectedUser: user.id,
  }));

  readonly loadUsers = this.effect<void>(
    pipe(
      switchMap(() =>
        this.userService
          .getAll()
          .pipe(
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
      selectedUser: -1,
      users: [],
    });
  }

  private mapArrayToViewModel(): (
    source$: Observable<UserStateModel[]>
  ) => Observable<User[]> {
    return (source$) =>
      source$.pipe(
        switchMap((users) =>
          users && users.length > 0
            ? of(users).pipe(
                mergeMap((users) => users.map((u) => this.getUser(u))),
                combineLatestAll()
              )
            : of([])
        )
      );
  }

  private mapOneToViewModel(): (
    source$: Observable<UserStateModel>
  ) => Observable<User> {
    return (source$) => source$.pipe(switchMap((user) => this.getUser(user)));
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
