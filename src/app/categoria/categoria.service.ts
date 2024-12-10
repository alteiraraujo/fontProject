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

  // Lista todas as categorias
  list(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API).pipe(
      delay(500),
      tap(console.log)
    );
  }

  // Atualiza o status de uma categoria
  updateStatus(id_categoria: number, status_categoria: string): Observable<any> {
    return this.http.put(`${this.API}/${id_categoria}`, { status_categoria }).pipe(
      tap(() =>
        console.log(`Status da categoria com ID ${id_categoria} atualizado para ${status_categoria}`)
      )
    );
  }

  // Cria uma nova categoria
  create(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API, categoria).pipe(
      tap((novaCategoria) =>
        console.log(`Categoria criada: `, novaCategoria)
      )
    );
  }

  // Busca uma categoria por ID
  getById(id_categoria: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API}/${id_categoria}`).pipe(
      tap((categoria) =>
        console.log(`Categoria carregada: `, categoria)
      )
    );
  }

  // Atualiza uma categoria existente
  update(id_categoria: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API}/${id_categoria}`, categoria).pipe(
      tap((categoriaAtualizada) =>
        console.log(`Categoria atualizada: `, categoriaAtualizada)
      )
    );
  }

  // Remove uma categoria
  delete(id_categoria: number): Observable<any> {
    return this.http.delete(`${this.API}/${id_categoria}`).pipe(
      tap(() =>
        console.log(`Categoria com ID ${id_categoria} removida`)
      )
    );
  }
}
