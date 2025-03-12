import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'ulster',
    loadComponent: () => import('./ulster/ulster.page').then( m => m.UlsterPage)
  },
  {
    path: 'muster',
    loadComponent: () => import('./muster/muster.page').then( m => m.MusterPage)
  },
  {
    path: 'connaught',
    loadComponent: () => import('./connaught/connaught.page').then( m => m.ConnaughtPage)
  },
  {
    path: 'leinster',
    loadComponent: () => import('./leinster/leinster.page').then( m => m.LeinsterPage)
  },
  {
    path: 'counties',
    loadComponent: () => import('./leinster/counties/counties.page').then( m => m.CountiesPage)
  },
];
