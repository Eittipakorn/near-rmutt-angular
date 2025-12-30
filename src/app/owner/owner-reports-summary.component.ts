
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { UserService } from '../services/user.service';

function startOfDay(d: Date) { const x = new Date(d); x.setHours(0,0,0,0); return x; }
function endOfDay(d: Date) { const x = new Date(d); x.setHours(23,59,59,999); return x; }

@Component({
  selector: 'app-owner-reports-summary',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './owner-reports-summary.component.html'
})
export class OwnerReportsSummaryComponent {
  from: string = ''; to: string = '';
  constructor(public ls: ListingService, public us: UserService) { this.ls.load(); }

  private owned() {
    const u = this.us.currentUser();
    return u ? this.ls.listings().filter(l => l.ownerEmail === u.email) : [];
  }

  get filtered() {
    const f = this.from, t = this.to, items = this.owned();
    if (!f && !t) return items;
    const fromDate = f ? startOfDay(new Date(f)) : null;
    const toDate = t ? endOfDay(new Date(t)) : null;
    return items.filter(x => {
      const d = x.createdAt ? new Date(x.createdAt) : new Date();
      return (!fromDate || d >= fromDate) && (!toDate || d <= toDate);
    });
  }

  get count() { return this.filtered.length; }
  get avgPrice() {
    const arr = this.filtered.map(x => x.price ?? 0).filter(x => x > 0);
    if (!arr.length) return 0; return Math.round(arr.reduce((a,b)=>a+b,0) / arr.length);
  }

  setRange(kind: 'today'|'week'|'month'|'lastweek') {
    const now = new Date();
    if (kind==='today') { this.from = now.toISOString().slice(0,10); this.to = this.from; }
    else if (kind==='week') {
      const d = new Date(now); const day = d.getDay()||7; const start = new Date(d); start.setDate(d.getDate()-day+1); const end = new Date(start); end.setDate(start.getDate()+6);
      this.from = start.toISOString().slice(0,10); this.to = end.toISOString().slice(0,10);
    }
    else if (kind==='lastweek') {
      const d = new Date(now); const day = d.getDay()||7; const start = new Date(d); start.setDate(d.getDate()-day-6); const end = new Date(start); end.setDate(start.getDate()+6);
      this.from = start.toISOString().slice(0,10); this.to = end.toISOString().slice(0,10);
    }
    else if (kind==='month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1); const end = new Date(now.getFullYear(), now.getMonth()+1, 0);
      this.from = start.toISOString().slice(0,10); this.to = end.toISOString().slice(0,10);
    }
  }
}
