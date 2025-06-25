import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/colaboradores/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(login_colaborador: string, senha_colaborador: string): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, {
        login_colaborador,
        senha_colaborador,
      })
      .pipe(
        tap((res) => {
          if (res && res.colaborador) {
            // Salva dados do usuário no localStorage (pode customizar)
            localStorage.setItem('token', JSON.stringify(res.colaborador));
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsuario() {
    const usuario = localStorage.getItem('token');
    return usuario ? JSON.parse(usuario) : null;
  }
}
