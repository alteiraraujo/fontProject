import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  validateForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [false] // ou [null]
    });
  }

  submitForm(): void {
    this.error = '';
    if (this.validateForm.invalid) {
      this.error = 'Preencha usuário e senha!';
      return;
    }
    this.loading = true;
    const login = this.validateForm.value.username;
    const senha = this.validateForm.value.password;

    this.authService.login(login, senha).subscribe({
      next: (res) => {
        this.loading = false;
        localStorage.setItem('colaborador', JSON.stringify(res.colaborador));
        console.log('Token no localStorage:', localStorage.getItem('token'));
        this.router.navigate(['/animais']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Usuário ou senha inválidos!';
        } else {
          this.error = 'Erro ao tentar login. Tente novamente!';
        }
      },
    });
  }
}
