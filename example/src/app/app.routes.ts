import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scan',
    loadComponent: () => import('./scan/scan.page').then((m) => m.ScanPageComponent),
  },
  {
    path: 'device',
    loadComponent: () =>
      import('./scan/device-overview/device-overview.page').then((m) => m.DeviceOverviewPageComponent),
  },
  {
    path: '',
    redirectTo: 'scan',
    pathMatch: 'full',
  },
];
