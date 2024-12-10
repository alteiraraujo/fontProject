import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ColaboradorService } from '../colaborador.service';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { Colaborador } from '../colaborador';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PessoaFormComponent } from 'src/app/pessoa/pessoa-form/pessoa-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-colaborador-form',
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.css'],
})
export class ColaboradorFormComponent implements OnInit {
  colaboradorForm: FormGroup;
  pessoas$: Observable<any[]>; // Lista de pessoas
  selectedPessoaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private pessoaService: PessoaService,
    private modal: NzModalService,
    private message: NzMessageService // Serviço de mensagens
  ) {}

  ngOnInit(): void {
    this.pessoas$ = this.pessoaService.list();

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
    if (this.colaboradorForm.invalid) {
      // Marca todos os campos como "tocados" para exibir os erros
      Object.values(this.colaboradorForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
      return;
    }
  
    const colaborador: Colaborador = {
      ...this.colaboradorForm.value,
      tbl_pessoa_id:
        this.selectedPessoaId || this.colaboradorForm.value.tbl_pessoa_id,
    };
  
    this.colaboradorService.add(colaborador).subscribe({
      next: () => {
        this.message.success('Colaborador cadastrado com sucesso!');
        this.colaboradorForm.reset();
        this.refreshPessoasList();
      },
      error: () => {
        this.message.error('Erro ao cadastrar colaborador.');
      },
    });
  }
  

  openPessoaModal(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Cadastrar Pessoa',
      nzContent: PessoaFormComponent,
      nzFooter: null,
      nzWidth: '600px',
    });

    const instance = modalRef.getContentComponent() as PessoaFormComponent;

    instance.pessoaCadastrada.subscribe((novaPessoa: any) => {
      this.message.success('Pessoa cadastrada com sucesso!');
      modalRef.close();
      this.refreshPessoasList();
    });

    instance.cancelado.subscribe(() => {
      this.message.info('Cadastro de pessoa cancelado.');
      modalRef.close();
    });
  }

  refreshPessoasList(): void {
    this.pessoas$ = this.pessoaService.list();
  }

  onPessoaChange(pessoaId: number): void {
    this.selectedPessoaId = pessoaId;
  }

  cancelar(): void {
    this.colaboradorForm.reset();
    this.selectedPessoaId = null;
  }
}
