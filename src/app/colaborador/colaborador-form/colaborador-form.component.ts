import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ColaboradorService } from '../colaborador.service';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { Colaborador } from '../colaborador';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PessoaFormComponent } from 'src/app/pessoa/pessoa-form/pessoa-form.component';

@Component({
  selector: 'app-colaborador-form',
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.css'],
})
export class ColaboradorFormComponent implements OnInit {
  colaboradorForm: FormGroup;
  pessoas$: Observable<any[]>; // Lista de pessoas para buscar
  selectedPessoaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private pessoaService: PessoaService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.pessoas$ = this.pessoaService.list(); // Busca pessoas disponíveis

    this.colaboradorForm = this.fb.group({
      tbl_pessoa_id: [null, Validators.required],
      selectedPessoaId: [null],
      cargo_colaborador: [null, Validators.required],
      login_colaborador: ['', Validators.required],
      senha_colaborador: ['', Validators.required],
      email_colaborador: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.colaboradorForm.valid) {
      const colaborador: Colaborador = {
        ...this.colaboradorForm.value,
        tbl_pessoa_id:
          this.selectedPessoaId || this.colaboradorForm.value.tbl_pessoa_id,
      };

      this.colaboradorService.add(colaborador).subscribe({
        next: () => {
          alert('Colaborador cadastrado com sucesso!');
          this.colaboradorForm.reset();
          this.refreshPessoasList(); // Atualiza a lista de pessoas após o cadastro
        },
        error: () => {
          alert('Erro ao cadastrar colaborador.');
        },
      });
    }
  }

  // Abrir modal para adicionar nova pessoa
  openPessoaModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Pessoa',
      nzContent: PessoaFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });

    const instance = modalRef.getContentComponent() as PessoaFormComponent;

    // Escuta o evento de cadastro concluído
    instance.pessoaCadastrada.subscribe((novaPessoa: any) => {
      console.log('Pessoa cadastrada:', novaPessoa);
      modalRef.close(); // Fecha o modal após o cadastro
      this.refreshPessoasList(); // Atualiza a lista de pessoas disponíveis
    });

    // Escuta o evento de cancelamento
    instance.cancelado.subscribe(() => {
      console.log('Cadastro de pessoa cancelado');
      modalRef.close(); // Fecha o modal
    });
  }

  // Atualizar a lista de pessoas após cadastro
  refreshPessoasList(): void {
    this.pessoas$ = this.pessoaService.list();
  }

  // Alterar a pessoa selecionada
  onPessoaChange(pessoaId: number): void {
    this.selectedPessoaId = pessoaId;
  }
}
