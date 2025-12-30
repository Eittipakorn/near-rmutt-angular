
import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-owner-reports',
  standalone: true,
  templateUrl: './owner-reports.component.html'
})
export class OwnerReportsComponent {
  constructor(public bs: BookingService, public us: UserService) {}
  get list() { const u = this.us.currentUser(); return u ? this.bs.ownerBookingsBy(u.email) : []; }
  approve(id: number) { this.bs.approve(id); }
  reject(id: number) { this.bs.reject(id); }
  cancel(id: number) { this.bs.cancel(id); }
}
