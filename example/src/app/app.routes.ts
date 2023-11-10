import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'scan',
    loadComponent: () => import('./scan/scan.page').then((m) => m.ScanPageComponent),
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
