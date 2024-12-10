import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Pessoa } from './pessoa';
import { PessoaService } from './pessoa.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './pessoa.component.html',
  styleUrls: ['./pessoa.component.css'],
  preserveWhitespaces: true,
})
export class PessoaComponent implements OnInit {
  pessoas$: Observable<Pessoa[]>;
  pessoasFiltradas$: Observable<Pessoa[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(private service: PessoaService) {}

  ngOnInit(): void {
    this.carregarPessoas();
  }

  carregarPessoas(): void {
    this.pessoas$ = this.service.list();
    this.atualizarPessoasFiltradas();
  }

  atualizarPessoasFiltradas(): void {
    this.pessoasFiltradas$ = this.pessoas$.pipe(
      map((pessoas) =>
        pessoas
          .filter(
            (pessoa) =>
              (this.statusFilter === '' || pessoa.status_pessoa === this.statusFilter) &&
              pessoa.nome_pessoa.toLowerCase().includes(this.searchValue.toLowerCase())
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
    this.atualizarPessoasFiltradas();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarPessoasFiltradas();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarPessoasFiltradas();
  }

  toggleStatus(pessoa: Pessoa): void {
    const novoStatus = pessoa.status_pessoa === 'Ativo' ? 'Inativo' : 'Ativo';
    const confirmacao = confirm(
      `Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} esta pessoa?`
    );

    if (confirmacao) {
      this.service.updateStatus(pessoa.id_pessoa, novoStatus).subscribe({
        next: () => {
          pessoa.status_pessoa = novoStatus;
          this.atualizarPessoasFiltradas();
          console.log('Status atualizado com sucesso no backend.');
        },
        error: (error) => {
          console.error('Erro ao atualizar status no backend:', error);
          alert('Não foi possível atualizar o status no servidor.');
        },
      });
    }
  }

  onPessoaCadastrada(novaPessoa: Pessoa): void {
    console.log('Nova pessoa cadastrada:', novaPessoa);
    this.carregarPessoas(); // Recarrega a lista para incluir a nova pessoa
  }
}
