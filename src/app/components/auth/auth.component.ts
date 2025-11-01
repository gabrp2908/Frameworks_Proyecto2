import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authForm: FormGroup;
  isLoginMode: boolean = true;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.authForm = this.createAuthForm();
  }

  private createAuthForm(): FormGroup {
    const formConfig: any = {
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    };

    if (!this.isLoginMode) {
      formConfig.confirmPassword = ['', [Validators.required]];
    }

    const form = this.fb.group(formConfig);

    if (!this.isLoginMode) {
      form.setValidators(this.passwordMatchValidator);
    }

    return form;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.authForm = this.createAuthForm();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.authForm.value;

      setTimeout(() => {
        let success = false;

        if (this.isLoginMode) {
          success = this.authService.login(username, password);
          if (!success) {
            this.errorMessage = 'Usuario o contraseña incorrectos';
          }
        } else {
          success = this.authService.register({
            username,
            password,
            email: '' // email vacío al eliminarlo
          } as any);

          if (!success) {
            this.errorMessage = 'El usuario ya existe';
          }
        }

        if (success) {
          this.router.navigate(['/time']);
        }

        this.isLoading = false;
      }, 1000);
    }
  }

  getModeText(): string {
    return this.isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
  }

  getToggleText(): string {
    return this.isLoginMode
      ? '¿No tienes cuenta? Regístrate aquí'
      : '¿Ya tienes cuenta? Inicia sesión aquí';
  }

  getToggleAction(): string {
    return this.isLoginMode ? 'Registrarse' : 'Iniciar Sesión';
  }
}
