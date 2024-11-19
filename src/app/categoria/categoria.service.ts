import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from './categoria';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly API = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) {}

  list(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API)
      .pipe(
        delay(500),
        tap(console.log)
      );
  }

  updateStatus(id_categoria: number, status_categoria: string): Observable<any> {
    return this.http.put(`${this.API}/${id_categoria}`, { status_categoria: status_categoria })
      .pipe(
        tap(() => console.log(`Status da categoria com ID ${id_categoria} atualizado para ${status_categoria}`))
      );
  }
}
