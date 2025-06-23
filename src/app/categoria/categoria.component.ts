import { Component, OnInit } from '@angular/core';
import { Observable, map, catchError, of, finalize } from 'rxjs';
import { Categoria } from './categoria';
import { CategoriaService } from './categoria.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzMessageService } from 'ng-zorro-antd/message';


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
  carregando = false;


  constructor(
    private service: CategoriaService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.carregando = true;
    this.categorias$ = this.service.list().pipe(
      finalize(() => this.carregando = false),
      catchError((error) => {
        this.carregando = false;
        console.error('Erro ao carregar categorias:', error);
        this.message.error('Falha ao carregar categorias.');
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
      nzTitle: 'Confirmação',
      nzContent: `Deseja realmente ${novoStatus === 'Ativo' ? 'ativar' : 'desativar'} esta categoria?`,
      nzOkText: 'Sim',
      nzOkType: 'primary',
      nzOnOk: () =>
        this.service.updateStatus(categoria.id_categoria!, novoStatus).subscribe({
          next: () => {
            categoria.status_categoria = novoStatus; // Atualiza o status localmente
            this.message.success(
              `Status da categoria atualizado para ${novoStatus}.`
            );
            this.atualizarCategoriasFiltradas(); // Atualiza a lista filtrada
          },
          error: (error) => {
            console.error('Erro ao atualizar status no backend:', error);
            this.message.error( "Erro ao tentar atualizar");
          }
        }),
      nzCancelText: 'Não',
      nzOnCancel: () => {
        this.message.info('Ação de alteração de status foi cancelada.');
      }
    });

    this.carregarCategorias();
  }
  abrirModal(modo: 'cadastrar' | 'editar' | 'abrir', categoria?: Categoria): void {
    if (modo === 'editar') {
      this.modal.confirm({
        nzTitle: 'Confirmação',
        nzContent: 'Tem certeza que deseja editar esta categoria?',
        nzOkText: 'Sim',
        nzCancelText: 'Não',
        nzOnOk: () => this.abrirFormularioModal(modo, categoria), // Confirmação para abrir o modal de edição
      });
    } else {
      this.abrirFormularioModal(modo, categoria);
    }
  }
  
  private abrirFormularioModal(modo: 'cadastrar' | 'editar' | 'abrir', categoria?: Categoria): void {
    const modalRef = this.modal.create({
      nzTitle: modo === 'cadastrar' ? 'Cadastrar Categoria' : modo === 'editar' ? 'Editar Categoria' : 'Detalhes da Categoria',
      nzContent: CategoriaFormComponent,
      nzComponentParams: {
        categoria: categoria ? { ...categoria } : undefined,
        modo: modo,
      },
      nzFooter: modo === 'abrir' ? [{ label: 'Ok', onClick: () => modalRef.close() }] : null,
      nzWidth: '600px',
    });
  
    modalRef.afterClose.subscribe((resultado?: Categoria) => {
      if (resultado && modo === 'editar') {
        this.service.update(resultado.id_categoria!, resultado).subscribe({
          next: () => {
            this.message.success('Categoria atualizada com sucesso!');
            this.carregarCategorias();
          },
          error: (error) => {
            console.error('Erro ao atualizar categoria:', error);
            this.message.error('Falha ao atualizar categoria.');
          },
        });
      } else if (resultado && modo === 'cadastrar') {
        this.onNovaCategoria(resultado);
      }
    });
  }
  

  onNovaCategoria(novaCategoria: Categoria): void {
    novaCategoria.status_categoria = 'Ativo'; // Define o status como "Ativo"
    this.service.create(novaCategoria).subscribe({
      next: () => {
        this.message.success( 'Categoria cadastrada com sucesso!');
        this.carregarCategorias(); // Atualiza a lista após o cadastro
      },
      error: (error) => {
        console.error('Erro ao cadastrar categoria:', error);
        this.message.error('Falha ao cadastrar categoria.');
      }
    });
  }
}