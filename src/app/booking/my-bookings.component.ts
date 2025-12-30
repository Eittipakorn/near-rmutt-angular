// src/app/booking/my-bookings.component.ts
import { Component, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService, Booking } from '../services/booking.service';
import { ListingService } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  template: `
  <div class="container">
    <h2 class="page-title">การจองของฉัน</h2>

    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>หอ</th>
            <th>ช่วง</th>
            <th>สถานะ</th>
            <th>ราคารวม</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          @for (b of items(); track b.id; let i = $index) {
            <tr>
              <td>{{ i + 1 }}</td>
              <td>{{ getListingTitle(b.listingId) }}</td>

              <td>
                <input
                  type="date"
                  class="in"
                  [disabled]="locked(b)"
                  [(ngModel)]="getEdit(b).startDate" />
                →
                <input
                  type="date"
                  class="in"
                  [disabled]="locked(b)"
                  [(ngModel)]="getEdit(b).endDate" />
              </td>

              <td>
                <span class="badge"
                  [class.status-approved]="b.status === 'approved'"
                  [class.status-rejected]="b.status === 'rejected'"
                  [class.status-cancelled]="b.status === 'cancelled'">
                  {{ b.status ?? 'pending' }}
                </span>
              </td>

              <td> - </td>

              <td class="actions">
                <button class="btn btn-outline"
                        [disabled]="locked(b)"
                        (click)="save(b)">
                  แก้ไข
                </button>
                <button class="btn btn-ghost"
                        [disabled]="b.status === 'cancelled' || b.status === 'rejected'"
                        (click)="cancel(b)">
                  ยกเลิก
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>
  `,
  styles: [`
    .in{ padding:8px 10px; border:1px solid #cfe5ff; border-radius:10px; }
    .actions{ display:flex; gap:8px; }
    .badge{ display:inline-block; padding:4px 10px; border-radius:999px; background:#e2e8f0; color:#0f172a; }
    .status-approved{ background:#dcfce7; color:#166534; border:1px solid #86efac; }
    .status-rejected{ background:#fee2e2; color:#7f1d1d; border:1px solid #fca5a5; }
    .status-cancelled{ background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; }
    .btn{ font:inherit; border:1px solid #90cafc; background:#25a6ff; color:#fff; border-radius:999px; padding:8px 16px; cursor:pointer; }
    .btn:hover{ filter:brightness(1.03); box-shadow:0 8px 16px rgba(37,166,255,.24); }
    .btn-outline{ background:#fff; color:#1c8edf; }
    .btn-outline:hover{ background:#e9f5ff; }
    .btn-ghost{ background:#fff; color:#0f172a; border-color:#e2e8f0; }
    .btn-ghost:hover{ background:#f8fafc; }
  `]
})
export class MyBookingsComponent {
  /** ดึงรายการจองของผู้ใช้ปัจจุบัน */
  items = computed<Booking[]>(() => this.bs.myBookings());

  /** เก็บค่าที่กำลังแก้ไขของแต่ละแถว (key = booking.id) */
  private edits: Record<number, { startDate: string; endDate: string }> = {};

  constructor(
    private bs: BookingService,
    private ls: ListingService,
    public  us: UserService,
  ) {}

  /** สร้าง/คืนค่า object แก้ไขของแถวนี้ (กัน error ตอน ngModel เข้าถึงก่อน) */
  getEdit(b: Booking) {
    if (!this.edits[b.id]) {
      this.edits[b.id] = { startDate: b.startDate, endDate: b.endDate };
    }
    return this.edits[b.id];
  }

  /** แสดงชื่อหอแทนรหัส */
  getListingTitle(listingId: number): string {
    const l = this.ls.getById(listingId);
    return l?.title ?? `#${listingId}`;
  }

  /** ล็อกปุ่ม/ช่องแก้ไขถ้าจองถูกยกเลิก หรือถูกปฏิเสธ */
  locked(b: Booking) {
    return b.status === 'cancelled' || b.status === 'rejected';
  }

  /** บันทึกช่วงวันที่ใหม่ */
  save(b: Booking) {
    const e = this.getEdit(b);
    const res = this.bs.update(b.id, { startDate: e.startDate, endDate: e.endDate });
    if (!res.success) {
      alert(res.error);
      // rollback
      this.edits[b.id] = { startDate: b.startDate, endDate: b.endDate };
      return;
    }
    // sync กลับเข้าแถว
    b.startDate = e.startDate;
    b.endDate   = e.endDate;
    alert('บันทึกการแก้ไขแล้ว');
  }

  /** ยกเลิกการจอง */
  cancel(b: Booking) {
    if (!confirm('ต้องการยกเลิกการจองนี้ใช่ไหม?')) return;
    const res = this.bs.cancel(b.id);
    if (!res.success) { alert(res.error); return; }
    b.status = 'cancelled';
  }
}
