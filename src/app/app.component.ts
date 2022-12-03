import { Component } from '@angular/core';
import { FacadeService } from './core/application/facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly selectedUser$ = this.facade.selectedUser$;
  readonly users$ = this.facade.users$;

  constructor(
    private readonly facade: FacadeService
  ) {}

  selectUser(id: number) {
    this.facade.selectUser(id);
  }
}
