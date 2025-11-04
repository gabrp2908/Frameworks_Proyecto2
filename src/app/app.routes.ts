import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { TimeVisualizerComponent } from './components/time-visualizer/time-visualizer.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'time', component: TimeVisualizerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/auth' }
];