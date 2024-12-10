import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { Raca } from './raca';
import { RacaService } from './raca.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { RacaFormComponent } from './raca-form/raca-form.component';

@Component({
  selector: 'app-raca',
  templateUrl: './raca.component.html',
  styleUrls: ['./raca.component.css'],
  preserveWhitespaces: true,
})
export class RacaComponent implements OnInit {
  racas$: Observable<Raca[]>;
  racasFiltradas$: Observable<Raca[]>;
  private racasSubject = new BehaviorSubject<Raca[]>([]);

  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  especieFilter: string = '';
  statusFilter: string = '';

  constructor(private service: RacaService, private modal: NzModalService) {}

  ngOnInit(): void {
    this.carregarRacas();
  }

  carregarRacas(): void {
    this.service.list().subscribe((racas) => {
      this.racasSubject.next(racas);
      this.atualizarRacasFiltradas();
    });
    this.racas$ = this.racasSubject.asObservable();
  }

  atualizarRacasFiltradas(): void {
    this.racasFiltradas$ = this.racas$.pipe(
      map((racas) =>
        racas
          .filter(
            (raca) =>
              (this.especieFilter === '' || raca.especie_raca === this.especieFilter) &&
              (this.statusFilter === '' || raca.status_raca === this.statusFilter) &&
              raca.nome_raca.toLowerCase().includes(this.searchValue.toLowerCase())
          )
          .slice(
            (this.pageIndex - 1) * this.pageSize,
            this.pageIndex * this.pageSize
          )
      )
    );
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.atualizarRacasFiltradas();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarRacasFiltradas();
  }

  onEspecieChange(especie: string): void {
    this.especieFilter = especie;
    this.pageIndex = 1;
    this.atualizarRacasFiltradas();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarRacasFiltradas();
  }

  toggleStatus(raca: Raca): void {
    const novoStatus = raca.status_raca === 'Ativo' ? 'Inativo' : 'Ativo';
    this.service.updateStatus(raca.id_raca, novoStatus).subscribe(() => {
      alert(`Status da raça "${raca.nome_raca}" atualizado para ${novoStatus}`);
      this.carregarRacas(); // Atualiza a lista
    });
  }

  abrirModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Raça',
      nzContent: RacaFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });

    const instance = modalRef.getContentComponent() as RacaFormComponent;

    instance.racaCadastrada.subscribe((novaRaca: Raca) => {
      modalRef.close();
        this.carregarRacas(); // Atualiza a lista de raças
      
    });

    instance.cancelado.subscribe(() => {
      modalRef.close();
    });
  }
}
