import { Routes } from '@angular/router';
import { ownerGuard } from './services/owner.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'listings', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'listings', loadComponent: () => import('./listings/listings.component').then(m => m.ListingsComponent) },
  { path: 'listing/:id', loadComponent: () => import('./listing-detail/listing-detail.component').then(m => m.ListingDetailComponent) },
  { path: 'booking/:id', loadComponent: () => import('./booking/booking.component').then(m => m.BookingComponent) },
  { path: 'search', loadComponent: () => import('./listings/listing-search.component').then(m => m.ListingSearchComponent) },
  { path: 'booking-requests', loadComponent: () => import('./booking-requests/booking-requests.component').then(m => m.BookingRequestsComponent) },
  { path: 'create', canActivate: [ownerGuard], loadComponent: () => import('./listings/listing-create.component').then(m => m.ListingCreateComponent) },
  { path: 'profile', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },

  { 
    path: 'my-bookings',
    loadComponent: () => import('./booking/my-bookings.component')
      .then(m => m.MyBookingsComponent)
  },

  // Owner pages
  { path: 'owner/dashboard', canActivate: [ownerGuard], loadComponent: () => import('./owner/owner-dashboard.component').then(m => m.OwnerDashboardComponent) },
  { path: 'owner/listings', canActivate: [ownerGuard], loadComponent: () => import('./owner/owner-listings-table.component').then(m => m.OwnerListingsTableComponent) },
  { path: 'owner/bookings', canActivate: [ownerGuard], loadComponent: () => import('./owner/owner-bookings.component').then(m => m.OwnerBookingsComponent) },
  { path: 'reports', canActivate: [ownerGuard], loadComponent: () => import('./owner/owner-reports-summary.component').then(m => m.OwnerReportsSummaryComponent) },
  { path: 'upload', canActivate: [ownerGuard], loadComponent: () => import('./upload/upload-images.component').then(m => m.UploadImagesComponent) },
];
