import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CurrentUser } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Visualizador de Tiempo';
  subtitle = 'Proyecto 2 - Manejo de Frameworks';
  currentUser: CurrentUser | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}