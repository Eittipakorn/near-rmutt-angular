import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';             
import { ListingService, Listing } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],                         
  templateUrl: './my-listings.component.html'
})
export class MyListingsComponent {
  editing: Listing | null = null;

  constructor(public ls: ListingService, public us: UserService) {
    this.ls.load();
  }

  get items() {
    const u = this.us.currentUser();
    return u ? this.ls.myListings(u.email) : [];
  }

  startEdit(l: Listing) {
    this.editing = { ...l };
  }

  save() {
    if (!this.editing) return;
    this.ls.updateListing(this.editing.id, this.editing);
    this.editing = null;
  }

  cancel() {
    this.editing = null;
  }

  remove(id: number) {
    this.ls.removeListing(id);
  }
}