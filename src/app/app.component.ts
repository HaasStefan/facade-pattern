import { Component } from '@angular/core';
import { FacadeService } from './core/application/facade.service';
import { User } from './core/entities/view-models/user.model';

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

  selectUser(user: User) {
    console.log(user)
    this.facade.selectUser(user);
  }

  load() {
    this.facade.loadUsers();
  }
}
