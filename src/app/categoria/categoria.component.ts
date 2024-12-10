import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categorias$: Observable<Categoria[]>;
  categoriasFiltradas$: Observable<Categoria[]>;
  pageIndex = 1;
  pageSize = 8;
  searchValue: string = '';
  statusFilter: string = 'Ativo';

  constructor(
    private service: CategoriaService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categorias$ = this.service.list().pipe(
      catchError((error) => {
        console.error('Erro ao carregar categorias:', error);
        this.notification.error('Erro', 'Falha ao carregar categorias.');
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
    this.atualizarCategoriasFiltradas();
  }

  atualizarCategoriasFiltradas(): void {
    this.categoriasFiltradas$ = this.categorias$.pipe(
      map((categorias) =>
        categorias
          .filter(
            (categoria) =>
              (this.statusFilter === '' || categoria.status_categoria === this.statusFilter) &&
              (categoria.id_categoria?.toString().includes(this.searchValue) ||
                categoria.nome_categoria.toLowerCase().includes(this.searchValue.toLowerCase()))
          )
          .slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      )
    );
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.atualizarCategoriasFiltradas();
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.atualizarCategoriasFiltradas();
  }

  onStatusChange(status: string): void {
    this.statusFilter = status;
    this.pageIndex = 1;
    this.atualizarCategoriasFiltradas();
  }

  toggleStatus(categoria: Categoria): void {
    const novoStatus = categoria.status_categoria === 'Ativo' ? 'Inativo' : 'Ativo';
  
    this.modal.confirm({
      nzTitle: `Confirmação`,
      nzContent: `Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} esta categoria?`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzOnOk: () =>
        this.service.updateStatus(categoria.id_categoria!, novoStatus).subscribe({
          next: () => {
            categoria.status_categoria = novoStatus; // Atualiza o status localmente
            this.notification.success(
              'Sucesso',
              `Status da categoria atualizado para ${novoStatus}.`
            );
            this.atualizarCategoriasFiltradas(); // Atualiza a lista filtrada
          },
          error: (error) => {
            console.error('Erro ao atualizar status no backend:', error);
            this.notification.error('Erro', 'Falha ao atualizar o status.');
          }
        }),
      nzCancelText: 'Não',
      nzOnCancel: () => {
        this.notification.info('Cancelado', 'Ação de alteração de status foi cancelada.');
      }
    });

    this.carregarCategorias();
  }

  abrirModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Categoria',
      nzContent: CategoriaFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });

    modalRef.afterClose.subscribe((novaCategoria?: Categoria) => {
      if (novaCategoria) {
        this.service.create(novaCategoria).subscribe({
          next: () => {
            this.notification.success('Sucesso', 'Categoria cadastrada com sucesso!');
            this.carregarCategorias(); // Atualiza a lista após o cadastro
          },
          error: (error) => {
            console.error('Erro ao cadastrar categoria:', error);
            this.notification.error('Erro', 'Falha ao cadastrar categoria.');
          }
        });
      }
    });
  }

  onNovaCategoria(novaCategoria: Categoria): void {
    novaCategoria.status_categoria = 'Ativo'; // Define o status como "Ativo"
    this.service.create(novaCategoria).subscribe({
      next: () => {
        this.notification.success('Sucesso', 'Categoria cadastrada com sucesso!');
        this.carregarCategorias(); // Atualiza a lista após o cadastro
      },
      error: (error) => {
        console.error('Erro ao cadastrar categoria:', error);
        this.notification.error('Erro', 'Falha ao cadastrar categoria.');
      }
    });
  }
}
