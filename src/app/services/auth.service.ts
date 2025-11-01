import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, CurrentUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeUsers();
    this.loadCurrentUser();
  }

  private initializeUsers(): void {
    const users = this.getUsers();

    if (!users.find(u => u.username === 'admin')) {
      users.push({
        username: 'admin',
        password: '1234',
        createdAt: new Date()
      });
    }

    localStorage.setItem('users', JSON.stringify(users));
  }

  private loadCurrentUser(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  register(user: User): boolean {
    const users = this.getUsers();
    const userExists = users.find(u => u.username === user.username);

    if (userExists) {
      return false;
    }

    user.createdAt = new Date();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    const currentUser: CurrentUser = {
      username: user.username,
      email: '',
      loginTime: new Date()
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    this.currentUserSubject.next(currentUser);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      const currentUser: CurrentUser = {
        username: user.username,
        email: '',
        loginTime: new Date()
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.currentUserSubject.next(currentUser);
      return true;
    }

    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
}
