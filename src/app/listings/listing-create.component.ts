
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { UserService } from '../services/user.service';

@Component({ selector: 'app-listing-create', standalone: true, imports: [FormsModule], templateUrl: './listing-create.component.html' })
export class ListingCreateComponent {
  title = ''; area: string | null = 'คลองหก'; type: string | null = 'หอพัก'; price: number | null = null; images: string[] = [];
  deposit: number | null = null; electricity_rate: string | null = '7 บาท/ยูนิต'; water_rate: string | null = '30 บาท/ยูนิต'; other_fee: number | null = 0;
  internet: string | null = 'ฟรี'; description: string | null = '';
  contact_phone: string | null = ''; contact_line: string | null = ''; contact_facebook: string | null = ''; contact_email: string | null = '';
  map_url: string | null = '';
  msg: string | null = null;
  constructor(private ls: ListingService, private us: UserService, private router: Router) {}
  save() {
    this.msg = null;
    if (!this.us.isOwner()) { this.msg = 'ฟีเจอร์นี้สำหรับบัญชีเจ้าของหอเท่านั้น'; return; }
    if (!this.title || this.price === null) { this.msg = 'กรุณากรอกชื่อและราคา'; return; }
    const id = this.ls.addListing({ title: this.title, area: this.area, type: this.type, price: this.price, images: this.images, ownerEmail: this.us.currentUser()!.email, deposit: this.deposit, electricity_rate: this.electricity_rate, water_rate: this.water_rate, other_fee: this.other_fee, internet: this.internet, description: this.description, contact_phone: this.contact_phone, contact_line: this.contact_line, contact_facebook: this.contact_facebook, contact_email: this.contact_email, map_url: this.map_url });
    this.router.navigate(['/listing', id]);
  }
}
