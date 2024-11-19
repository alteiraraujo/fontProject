import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ColaboradorService } from '../colaborador.service';
import { PessoaService } from 'src/app/pessoa/pessoa.service';
import { Colaborador } from '../colaborador';

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
    private pessoaService: PessoaService
  ) {}

  ngOnInit(): void {
    this.pessoas$ = this.pessoaService.list(); // Busca pessoas disponíveis

    this.colaboradorForm = this.fb.group({
      tbl_pessoa_id: [null, Validators.required],
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
        },
        error: () => {
          alert('Erro ao cadastrar colaborador.');
        },
      });
    }
  }

  // Abrir modal para adicionar nova pessoa
  openPessoaModal(): void {
    // Lógica para abrir o modal de cadastro de nova pessoa
    // Exemplo: Usar um modal customizado
    console.log('Abrir modal para adicionar nova pessoa');
  }

  // Alterar a pessoa selecionada
  onPessoaChange(pessoaId: number): void {
    this.selectedPessoaId = pessoaId;
  }
}
