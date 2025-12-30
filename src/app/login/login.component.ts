
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-login', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './login.component.html' })
export class LoginComponent {
  email = ''; password = ''; error: string | null = null;
  constructor(public us: UserService, private router: Router) {}
  onSubmit() {
    this.error = null;
    if (!this.us.loaded()) { this.error = 'กำลังเตรียมข้อมูลผู้ใช้ โปรดลองอีกครั้ง'; return; }
    const ok = this.us.login(this.email.trim(), this.password);
    if (ok) this.router.navigateByUrl('/listings'); else this.error = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
  }
}
