
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { BookingService } from '../services/booking.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-owner-dashboard', standalone: true, imports: [RouterLink], templateUrl: './owner-dashboard.component.html' })
export class OwnerDashboardComponent {
  constructor(public ls: ListingService, public bs: BookingService, public us: UserService) { this.ls.load(); }
  get stats() {
    const u = this.us.currentUser(); if (!u) return { total:0, active:0, pending:0, approved:0 };
    const mine = this.ls.listings().filter(l => l.ownerEmail === u.email);
    const bookings = this.bs.ownerBookingsBy(u.email);
    return {
      total: mine.length,
      active: mine.filter(x => x.status === 'active').length,
      pending: bookings.filter(x => x.status === 'pending').length,
      approved: bookings.filter(x => x.status === 'approved').length,
    };
  }
  recent() { const u = this.us.currentUser(); if (!u) return []; return this.bs.ownerBookingsBy(u.email).slice(-3).reverse(); }
}
