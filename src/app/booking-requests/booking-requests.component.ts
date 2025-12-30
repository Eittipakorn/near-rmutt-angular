
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService, Booking } from '../services/booking.service';
import { UserService } from '../services/user.service';
import { CurrencyPipe } from '@angular/common';

@Component({ selector: 'app-booking-requests', standalone: true, imports: [FormsModule, CurrencyPipe], templateUrl: './booking-requests.component.html' })
export class BookingRequestsComponent {
  editingId: number | null = null; editStart = ''; editEnd = ''; editNotes = ''; message: string | null = null;
  constructor(public bs: BookingService, public us: UserService) {}
  get list(): Booking[] { return this.us.isOwner() ? this.bs.ownerBookingsBy(this.us.currentUser()!.email) : this.bs.myBookings(); }
  startEdit(b: Booking) { this.editingId = b.id; this.editStart = b.startDate; this.editEnd = b.endDate; this.editNotes = b.notes ?? ''; }
  saveEdit() { if (this.editingId == null) return; const res = this.bs.update(this.editingId, { startDate: this.editStart, endDate: this.editEnd, notes: this.editNotes }); this.message = res.success ? 'บันทึกสำเร็จ' : (res.error ?? 'บันทึกไม่สำเร็จ'); if (res.success) this.cancel(); }
  cancel() { this.editingId = null; this.editStart = this.editEnd = this.editNotes = ''; }
  remove(id: number) { this.bs.remove(id); }
}
