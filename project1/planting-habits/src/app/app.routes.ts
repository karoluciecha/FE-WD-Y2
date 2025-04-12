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
    path: 'edit-habit-all',
    loadComponent: () => import('./pages/edit-habit-all/edit-habit-all.page').then( m => m.EditHabitAllPage)
  },
  {
    path: 'edit-habit-details',
    loadComponent: () => import('./pages/edit-habit-details/edit-habit-details.page').then( m => m.EditHabitDetailsPage)
  },
  {
    path: 'edit-habit-details/:id',
    loadComponent: () => import('./pages/edit-habit-details/edit-habit-details.page').then(m => m.EditHabitDetailsPage)
  }, 
];
