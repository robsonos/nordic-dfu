import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scan',
    loadComponent: () => import('./scan/scan.page').then((m) => m.ScanPageComponent),
  },
  {
    path: 'device',
    loadComponent: () =>
      import('./scan/device-information/device-information.page').then((m) => m.DeviceInformationPageComponent),
  },
  {
    path: '',
    redirectTo: 'scan',
    pathMatch: 'full',
  },
];
