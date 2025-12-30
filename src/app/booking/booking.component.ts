
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { ListingService } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-booking', standalone: true, imports: [FormsModule], templateUrl: './booking.component.html' })
export class BookingComponent {
  listingId!: number; startDate = ''; endDate = ''; notes = ''; message: string | null = null;
  constructor(private route: ActivatedRoute, public bs: BookingService, public ls: ListingService, public us: UserService) { this.listingId = Number(this.route.snapshot.paramMap.get('id')); }
  submit() {
    this.message = null;
    if (!this.us.isAuthenticated()) { this.message = 'กรุณาเข้าสู่ระบบก่อนทำการจอง'; return; }
    if (this.us.isOwner()) { this.message = 'บัญชีเจ้าของหอไม่สามารถจองได้'; return; }
    const res = this.bs.create(this.listingId, this.startDate, this.endDate, this.notes || undefined);
    this.message = res.success ? 'ส่งคำขอจองสำเร็จ' : (res.error ?? 'ไม่สามารถส่งคำขอได้');
  }
}
