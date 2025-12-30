
import { Component } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-owner-bookings', standalone: true, templateUrl: './owner-bookings.component.html' })
export class OwnerBookingsComponent {
  constructor(public bs: BookingService, public us: UserService) {}
  get list() { const u = this.us.currentUser(); return u ? this.bs.ownerBookingsBy(u.email) : []; }
  approve(id: number) { this.bs.approve(id); }
  reject(id: number) { this.bs.reject(id); }
}
