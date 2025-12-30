import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common'; 
import { ListingService, Listing } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink], 
  templateUrl: './listing-detail.component.html'
})
export class ListingDetailComponent {
  listing: Listing | null = null;
  selectedImage = 0;

  constructor(
    private route: ActivatedRoute,
    public ls: ListingService,
    public us: UserService
  ) {
    this.ls.load();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const timer = setInterval(() => {
      const l = this.ls.getById(id);
      if (l) {
        this.listing = l;
        clearInterval(timer);
      }
    }, 100);
  }
}
