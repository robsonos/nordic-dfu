import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scan',
    loadComponent: () => import('./scan/scan.page').then((m) => m.ScanPageComponent),
  },
  {
    path: 'device-information',
    loadComponent: () =>
      import('./scan/device-information/device-information.page').then((m) => m.DeviceInformationPageComponent),
  },
  {
    path: 'dfu',
    loadComponent: () => import('./scan/dfu/dfu.page').then((m) => m.DfuComponent),
  },
  {
    path: '',
    redirectTo: 'scan',
    pathMatch: 'full',
  },
];
