import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor } from './fornecedor';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private readonly API = 'http://localhost:8080/fornecedores';

  constructor(private http: HttpClient) { }

  // Lista todos os fornecedores
  list(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.API);
  }

  // Obtém um fornecedor pelo ID
  getById(id_fornecedor: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.API}/${id_fornecedor}`);
  }

  // Cria um novo fornecedor
  create(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.API, fornecedor);
  }

  // Atualiza as informações de um fornecedor
  update(id_fornecedor: number, fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.API}/${id_fornecedor}`, fornecedor);
  }

  // Atualiza o status de um fornecedor
  updateStatus(id_fornecedor: number, status_fornecedor: string): Observable<any> {
    return this.http.put(`${this.API}/${id_fornecedor}`, { status_fornecedor: status_fornecedor });
  }

  // Deleta um fornecedor pelo ID
  delete(id_fornecedor: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id_fornecedor}`);
  }
}
