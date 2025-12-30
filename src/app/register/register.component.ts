
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService, User } from '../services/user.service';

@Component({ selector: 'app-register', standalone: true, imports: [FormsModule, RouterLink], templateUrl: './register.component.html' })
export class RegisterComponent {
  name = ''; email = ''; phone = ''; role: User['role'] = 'tenant'; password = ''; error: string | null = null;
  constructor(private us: UserService, private router: Router) {}
  onSubmit() {
    this.error = null;
    const name = this.name.trim(); const email = this.email.trim().toLowerCase(); const phone = this.phone.trim(); const password = this.password;
    if (!name || !email || !phone || !password) { this.error = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'; return; }
    const ok = this.us.register({ name, email, phone, role: this.role, password });
    if (!ok.success) { this.error = ok.error ?? 'สมัครสมาชิกไม่สำเร็จ'; return; }
    this.router.navigateByUrl('/listings');
  }
}
