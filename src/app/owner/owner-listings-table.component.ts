
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService, Listing } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-owner-listings-table', standalone: true, imports: [CurrencyPipe, RouterLink], templateUrl: './owner-listings-table.component.html' })
export class OwnerListingsTableComponent {
  constructor(public ls: ListingService, public us: UserService) { this.ls.load(); }
  get items(): Listing[] { const u = this.us.currentUser(); return u ? this.ls.myListings(u.email) : []; }
  remove(id: number) { this.ls.removeListing(id); }
}
