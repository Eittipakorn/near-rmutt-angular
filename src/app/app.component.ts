
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStatusComponent } from './auth-status/auth-status.component';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AuthStatusComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(public us: UserService) {}
}
