
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../services/user.service';

@Component({ selector: 'app-profile', standalone: true, imports: [FormsModule], templateUrl: './profile.component.html' })
export class ProfileComponent {
  model: Omit<User, 'role'> & { role: User['role'] } | null = null; editing = false; message: string | null = null;
  constructor(public us: UserService) { const u = this.us.currentUser(); if (u) this.model = { ...u }; }
  save() {
    this.message = null; const u = this.us.currentUser(); if (!u || !this.model) { this.message = 'กรุณาเข้าสู่ระบบ'; return; }
    const updated: User = { ...this.model, role: u.role };
    const users = this.us.users(); const idx = users.findIndex(x => x.email === u.email);
    if (idx >= 0) { users[idx] = updated; this.us.users.set([...users]); this.us.currentUser.set(updated); sessionStorage.setItem('currentUser', JSON.stringify(updated)); this.message = 'บันทึกโปรไฟล์สำเร็จ'; this.editing = false; }
  }
}
