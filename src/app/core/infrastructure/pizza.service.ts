import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, share } from 'rxjs';
import { Pizza } from '../entities/pizza.model';

@Injectable({
  providedIn: 'root',
})
export class PizzaService {
  private readonly pizzas$!: Observable<Pizza[]>;

  constructor(private readonly http: HttpClient) {
    this.pizzas$ = this.http.get<Pizza[]>('/assets/pizzas.json').pipe(
      share({
        connector: () => new ReplaySubject(),
      })
    );
  }

  get(id: number): Observable<Pizza | null> {
    return this.pizzas$.pipe(
      map(pizzas => {
        const pizza = pizzas.find(p => p.id === id);
        return pizza ?? null;
      })
    );
  }
}
