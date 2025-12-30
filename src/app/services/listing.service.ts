
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Listing {
  id: number; title: string; area: string | null; type: string | null; price: number | null;
  deposit?: number | null; electricity_rate?: string | null; water_rate?: string | null;
  other_fee?: number | null; internet?: string | null; description?: string | null; location?: string | null;
  contact_phone?: string | null; contact_line?: string | null; contact_facebook?: string | null;
  contact_email?: string | null; map_url?: string | null; details_long?: string | null;
  images: string[]; ownerEmail?: string | null; status?: 'active' | 'closed'; createdAt?: string;
}

interface ListingResponse { listings: Listing[] }

@Injectable({ providedIn: 'root' })
export class ListingService {
  listings = signal<Listing[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  private extra = signal<Listing[]>([]);

  constructor(private http: HttpClient) {}

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<ListingResponse>('assets/data/near_rmutt_listings_mock.json').subscribe({
      next: (json) => {
        const raw = sessionStorage.getItem('listings_extra');
        if (raw) { try { this.extra.set(JSON.parse(raw)); } catch {} }
        const merged = [...(json.listings ?? []), ...this.extra()];
        this.listings.set(merged);
        (window as any).__LISTINGS__ = merged;
        this.loading.set(false);
      },
      error: () => { this.error.set('โหลดข้อมูลไม่สำเร็จ'); this.loading.set(false); }
    });
  }

  private persistExtra() {
    sessionStorage.setItem('listings_extra', JSON.stringify(this.extra()));
    const merged = [...this.listings()];
    (window as any).__LISTINGS__ = merged;
  }

  addListing(l: Omit<Listing,'id'> & { id?: number }) {
    const id = l.id ?? Date.now();
    const item: Listing = { ...l, id, status: l.status ?? 'active', createdAt: l.createdAt ?? new Date().toISOString() };
    this.extra.set([...this.extra(), item]);
    this.listings.set([...this.listings(), item]);
    this.persistExtra();
    return id;
  }

  updateListing(id: number, patch: Partial<Listing>) {
    const next = this.extra().map(x => x.id === id ? { ...x, ...patch } : x);
    this.extra.set(next);
    this.listings.set(this.listings().map(x => x.id === id ? { ...x, ...patch } : x));
    this.persistExtra();
  }

  removeListing(id: number) {
    this.extra.set(this.extra().filter(x => x.id !== id));
    this.listings.set(this.listings().filter(x => x.id !== id));
    this.persistExtra();
  }

  myListings(ownerEmail: string) { return this.listings().filter(x => x.ownerEmail === ownerEmail); }
  getById(id: number): Listing | null { return this.listings().find(l => l.id === id) ?? null; }
}
