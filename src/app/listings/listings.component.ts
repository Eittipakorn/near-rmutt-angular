
import { Component, computed } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-listings', standalone: true, imports: [CurrencyPipe, RouterLink], templateUrl: './listings.component.html' })
export class ListingsComponent {
  constructor(public ls: ListingService, public us: UserService) { this.ls.load(); }
  data = computed(() => this.ls.listings());
}
