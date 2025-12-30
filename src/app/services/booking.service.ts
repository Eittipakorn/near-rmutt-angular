
import { Injectable, signal } from '@angular/core';
import { UserService } from './user.service';

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface Booking {
  id: number; listingId: number; userEmail: string; startDate: string; endDate: string; notes?: string; status?: BookingStatus; createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  bookings = signal<Booking[]>([]);

  constructor(private us: UserService) {
    const raw = sessionStorage.getItem('bookings');
    if (raw) { try { this.bookings.set(JSON.parse(raw)); } catch {} }
  }

  private persist() { sessionStorage.setItem('bookings', JSON.stringify(this.bookings())); }

  create(listingId: number, startDate: string, endDate: string, notes?: string) {
    const user = this.us.currentUser();
    if (!user) return { success: false, error: 'กรุณาเข้าสู่ระบบก่อนทำการจอง' };
    if (!startDate || !endDate) return { success: false, error: 'กรุณาเลือกช่วงวันที่ให้ครบ' };
    if (new Date(startDate) > new Date(endDate)) return { success: false, error: 'วันที่เริ่มต้องไม่หลังวันที่สิ้นสุด' };
    const id = Date.now();
    const next: Booking[] = [...this.bookings(), { id, listingId, userEmail: user.email, startDate, endDate, notes, status: 'pending' as const, createdAt: new Date().toISOString() }];
    this.bookings.set(next); this.persist(); return { success: true };
  }

  update(id: number, patch: Partial<Booking>) {
    const items = this.bookings(); const idx = items.findIndex(b => b.id == id);
    if (idx < 0) return { success: false, error: 'ไม่พบคำขอจอง' };
    const merged = { ...items[idx], ...patch };
    if (merged.startDate && merged.endDate && new Date(merged.startDate) > new Date(merged.endDate)) { return { success: false, error: 'วันที่เริ่มต้องไม่หลังวันที่สิ้นสุด' }; }
    items[idx] = merged as Booking; this.bookings.set([...items]); this.persist(); return { success: true };
  }

  remove(id: number) { this.bookings.set(this.bookings().filter(b => b.id != id)); this.persist(); }
  approve(id: number) { return this.setStatus(id, 'approved'); }
  reject(id: number)  { return this.setStatus(id, 'rejected'); }
  cancel(id: number)  { return this.setStatus(id, 'cancelled'); }
  private setStatus(id: number, s: BookingStatus) { const items = this.bookings(); const i = items.findIndex(b => b.id === id); if (i < 0) return { success: false, error: 'ไม่พบคำขอจอง' }; items[i] = { ...items[i], status: s }; this.bookings.set([...items]); this.persist(); return { success: true }; }
  myBookings(): Booking[] { const user = this.us.currentUser(); if (!user) return []; return this.bookings().filter(b => b.userEmail === user.email); }
  ownerBookingsBy(ownerEmail: string): Booking[] { const all = this.bookings(); const list = (window as any).__LISTINGS__ || []; return all.filter(b => { const l = list.find((x: any) => x.id === b.listingId); return l?.ownerEmail === ownerEmail; }); }
}
