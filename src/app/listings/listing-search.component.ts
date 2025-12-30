
import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService } from '../services/listing.service';

@Component({ selector: 'app-listing-search', standalone: true, imports: [CurrencyPipe, DatePipe, RouterLink], templateUrl: './listing-search.component.html' })
export class ListingSearchComponent {
  query = signal(''); minPrice = signal<number | null>(null); maxPrice = signal<number | null>(null);
  constructor(public ls: ListingService) { this.ls.load(); }
  data = computed(() => {
    const q = this.query().toLowerCase(); const min = this.minPrice(); const max = this.maxPrice();
    return this.ls.listings().filter(x => {
      const title = x.title.toLowerCase(); const price = x.price ?? 0;
      const matchTitle = !q || title.includes(q);
      const matchMin = min === null || price >= min;
      const matchMax = max === null || price <= max;
      return matchTitle && matchMin && matchMax;
    });
  });
}
