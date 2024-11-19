import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, tap } from 'rxjs';
import { Animal } from './animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private readonly API= 'http://localhost:8080/animais';

  constructor(private http: HttpClient) {}

  list(): Observable<Animal[]>{
    return this.http.get<Animal[]>(this.API)
    .pipe(
      delay(500),
      tap(console.log)
    );
  }

  updateStatus(id_animal: number, status_animal: string): Observable<any>{
    return this.http.put(`${this.API}/${id_animal}`, { status_animal: status_animal})
    .pipe(
      tap(() => console.log(`Status do animal com ID ${id_animal} atualizado para ${status_animal}`))
    );
  }
}
