
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListingService, Listing } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-upload-images', standalone: true, imports: [FormsModule], templateUrl: './upload-images.component.html' })
export class UploadImagesComponent {
  listingId: number | null = null; previews: string[] = []; message: string | null = null;
  constructor(public ls: ListingService, public us: UserService) { this.ls.load(); }
  get myListings(): Listing[] { const u = this.us.currentUser(); return u ? this.ls.myListings(u.email) : []; }
  onFiles(e: Event) {
    const input = e.target as HTMLInputElement; const files = input.files; if (!files || !files.length) return;
    this.previews = Array.from(files).map(f => URL.createObjectURL(f));
  }
  upload() {
    this.message = null; if (!this.listingId) { this.message = 'กรุณาเลือกประกาศ'; return; }
    const l = this.ls.getById(this.listingId); if (!l) { this.message = 'ไม่พบประกาศ'; return; }
    const imgs = [...(l.images || []), ...this.previews];
    this.ls.updateListing(l.id, { images: imgs });
    this.message = 'อัปโหลดสำเร็จ (จำลอง)'; this.previews = [];
  }
}
