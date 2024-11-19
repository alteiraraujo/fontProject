import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { Animal } from './animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private readonly API = 'http://localhost:8080/animais';

  constructor(private http: HttpClient) {}

  // Listar todos os animais
  list(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.API).pipe(
      delay(500),
      tap((animais) => console.log('Lista de animais:', animais))
    );
  }

  // Criar novo animal
  create(animal: Animal): Observable<Animal> {
    return this.http.post<Animal>(this.API, animal).pipe(
      tap((novoAnimal) => console.log('Animal criado:', novoAnimal))
    );
  }

  // Atualizar animal existente
  update(id_animal: number, animal: Animal): Observable<Animal> {
    return this.http.put<Animal>(`${this.API}/${id_animal}`, animal).pipe(
      tap(() => console.log(`Animal com ID ${id_animal} atualizado.`))
    );
  }

  // Alterar o status do animal
  updateStatus(id_animal: number, status_animal: string): Observable<any> {
    return this.http.put(`${this.API}/${id_animal}`, { status_animal: status_animal }).pipe(
      tap(() => console.log(`Status do animal com ID ${id_animal} atualizado para ${status_animal}`))
    );
  }

  // Remover um animal
  delete(id_animal: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id_animal}`).pipe(
      tap(() => console.log(`Animal com ID ${id_animal} removido.`))
    );
  }
}
