import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from './produto';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProdutosService {
  private readonly API = 'http://localhost:8080/produtos';

  constructor(private http: HttpClient) {}

  // Listar todos os produtos
  list(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API).pipe(
      delay(500), // Simula um delay na resposta
      tap(console.log)
    );
  }

  // Criar um novo produto
  create(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.API, produto).pipe(
      tap((novoProduto) =>
        console.log('Produto criado com sucesso:', novoProduto)
      )
    );
  }

  // Atualizar um produto existente
  update(id_produto: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${id_produto}`, produto).pipe(
      tap((produtoAtualizado) =>
        console.log('Produto atualizado com sucesso:', produtoAtualizado)
      )
    );
  }

  // Atualizar status de um produto
  updateStatus(id_produto: number, status: string): Observable<any> {
    return this.http
      .put(`${this.API}/${id_produto}`, { status_produto: status })
      .pipe(
        tap(() =>
          console.log(`Status do produto com ID ${id_produto} atualizado para ${status}`)
        )
      );
  }

  // Deletar um produto
  delete(id_produto: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id_produto}`).pipe(
      tap(() =>
        console.log(`Produto com ID ${id_produto} deletado com sucesso`)
      )
    );
  }

  // Buscar um produto por ID
  getById(id_produto: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id_produto}`).pipe(
      tap((produto) =>
        console.log(`Produto encontrado com ID ${id_produto}:`, produto)
      )
    );
  }
}
