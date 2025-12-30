
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-auth-status',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (us.isAuthenticated()) {
      <span>สวัสดี, {{ us.currentUser()?.name }} ({{ us.currentUser()?.role }})</span>
      <a routerLink="/owner/dashboard" *ngIf="us.isOwner()" style="margin-left:8px;">แดชบอร์ด</a>
      <button (click)="logout()" style="margin-left:8px;">ออกจากระบบ</button>
    } @else {
      <a routerLink="/login">เข้าสู่ระบบ</a>
      <span> | </span>
      <a routerLink="/register">สมัครสมาชิก</a>
    }
  `
})
export class AuthStatusComponent {
  constructor(public us: UserService, private router: Router) {}
  logout() { this.us.logout(); this.router.navigateByUrl('/login'); }
}
