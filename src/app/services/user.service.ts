
import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface User { name: string; email: string; phone: string; role: 'owner'|'tenant'|'admin'; password: string; createdAt?: string; }
interface UserResponse { users: User[] }

@Injectable({ providedIn: 'root' })
export class UserService {
  users = signal<User[]>([]);
  currentUser = signal<User | null>(null);
  loaded = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    const raw = sessionStorage.getItem('currentUser');
    if (raw) this.currentUser.set(JSON.parse(raw));

    this.http.get<UserResponse>('assets/data/near_rmutt_listings_mock.json').subscribe({
      next: (json) => { this.users.set(json.users ?? []); this.loaded.set(true); },
      error: () => { this.error.set('โหลดข้อมูลผู้ใช้ไม่สำเร็จ'); this.loaded.set(true); }
    });
  }

  isAuthenticated = computed(() => !!this.currentUser());
  isOwner = computed(() => this.currentUser()?.role === 'owner');
  isTenant = computed(() => this.currentUser()?.role === 'tenant');

  login(email: string, password: string): boolean {
    if (!this.loaded()) return false;
    const u = this.users().find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (u) {
      this.currentUser.set(u);
      sessionStorage.setItem('currentUser', JSON.stringify(u));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem('currentUser');
  }

  register(u: { name: string; email: string; phone: string; role: User['role']; password: string })
    : { success: boolean; error?: string } {
    if (!this.loaded()) return { success: false, error: 'กำลังเตรียมข้อมูลผู้ใช้ โปรดลองอีกครั้ง' };
    const email = u.email.toLowerCase();
    const exists = this.users().some(x => x.email.toLowerCase() == email);
    if (exists) return { success: false, error: 'อีเมลนี้ถูกใช้แล้ว' };
    const next = [...this.users(), { ...u, createdAt: new Date().toISOString() }];
    this.users.set(next);
    this.currentUser.set({ ...u });
    sessionStorage.setItem('currentUser', JSON.stringify({ ...u }));
    return { success: true };
  }
}
