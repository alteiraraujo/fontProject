import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { PessoaService } from '../pessoa.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Pessoa } from '../pessoa';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css'],
})
export class PessoaFormComponent implements OnInit, OnChanges {
  @Output() pessoaCadastrada = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  @Input() pessoa?: Pessoa;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  pessoaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private router: Router,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    if (this.pessoa) {
      this.preencherFormulario(this.pessoa);
    }
    if (this.modo === 'abrir') {
      this.pessoaForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pessoa'] && changes['pessoa'].currentValue) {
      this.preencherFormulario(changes['pessoa'].currentValue);
    }
    if (changes['modo'] && changes['modo'].currentValue === 'abrir') {
      this.pessoaForm?.disable();
    }
    if (changes['modo'] && changes['modo'].currentValue !== 'abrir') {
      this.pessoaForm?.enable();
    }
  }

  criarFormulario() {
    this.pessoaForm = this.fb.group({
      nome_pessoa: ['', [Validators.required]],
      cpfPessoa: [
        '',
        {
          validators: [Validators.required, this.validarCPF],
          asyncValidators: [this.cpfExistenteValidator.bind(this)],
          updateOn: 'blur', // ou 'change' se preferir
        },
      ],
      data_nascimento_pessoa: [
        null,
        [Validators.required, this.validarDataNascimento],
      ],
      telefone_pessoa: [
        '',
        [Validators.required, this.validarTelefone.bind(this)],
      ],
      phoneNumberPrefix: ['+55'],
      complemento_pessoa: [''],
      cep_pessoa: ['', [Validators.required]],
      cidade_pessoa: [''],
      estado_pessoa: [''],
      uf_pessoa: [''],
      rua_pessoa: [''],
      bairro_pessoa: [''],
      numero_pessoa: ['', Validators.required],
      genero_pessoa: [this.pessoa?.genero_pessoa || 'Não Especificar'],
    });
  }

  preencherFormulario(pessoa: Pessoa) {
    if (this.pessoaForm) {
      this.pessoaForm.patchValue({
        nome_pessoa: pessoa.nome_pessoa || '',
        cpfPessoa: this.formatarCPFValue(pessoa.cpfPessoa || ''),
        data_nascimento_pessoa: pessoa.data_nascimento_pessoa || '',
        telefone_pessoa: this.formatarTelefoneValue(
          pessoa.telefone_pessoa || ''
        ),
        phoneNumberPrefix: '+55',
        cep_pessoa: this.formatarCEPValue(pessoa.cep_pessoa || ''),
        cidade_pessoa: pessoa.cidade_pessoa || '',
        estado_pessoa: pessoa.estado_pessoa || '',
        uf_pessoa: pessoa.uf_pessoa || '',
        rua_pessoa: pessoa.rua_pessoa || '',
        bairro_pessoa: pessoa.bairro_pessoa || '',
        numero_pessoa: pessoa.numero_pessoa || '',
        genero_pessoa: pessoa.genero_pessoa || '',
      });
    }
  }

  submitForm(): void {
  if (this.pessoaForm.valid) {
    const pessoaData = {
      ...this.pessoaForm.getRawValue(),
      status_pessoa: 'Ativo',
      telefone_pessoa: (this.pessoaForm.value.telefone_pessoa || '').replace(/\D/g, ''),
      cpfPessoa: (this.pessoaForm.value.cpfPessoa || '').replace(/\D/g, ''),
      cep_pessoa: (this.pessoaForm.value.cep_pessoa || '').replace(/\D/g, ''),
    };

       console.log('Payload enviado para o backend:', pessoaData);

    if (this.modo === 'editar' && this.pessoa && this.pessoa.id_pessoa) {
      this.pessoaService.update(this.pessoa.id_pessoa, pessoaData).subscribe({
        next: (response) => {
          this.message.success('Pessoa atualizada com sucesso!');
          this.modalRef.close(response);
        },
        error: () => {
          this.message.error('Erro ao atualizar pessoa. Tente novamente.');
        },
      });
    } else if (this.modo === 'cadastrar') {
      this.pessoaService.cadastrarPessoa(pessoaData).subscribe({
        next: (response) => {
          this.message.success('Pessoa cadastrada com sucesso!');
          this.modalRef.close(response);
        },
        error: () => {
          this.message.error('Erro ao cadastrar pessoa. Tente novamente.');
        },
      });
    }
  } else {
    this.validarFormulario();
    this.message.error('Por favor, preencha todos os campos obrigatórios.');
  }
}


  cancelar(): void {
    this.modalRef.close(); // cancela e fecha o modal
  }

  buscarCEP(): void {
    const cep = this.pessoaForm.get('cep_pessoa')?.value;
    if (cep) {
      this.pessoaService.buscarCEP(cep).subscribe((data: any) => {
        if (data && !data.erro) {
          this.pessoaForm.patchValue({
            cidade_pessoa: data.localidade,
            estado_pessoa: data.estado,
            rua_pessoa: data.logradouro,
            bairro_pessoa: data.bairro,
            uf_pessoa: data.uf,
          });
        } else {
          this.message.warning(
            'CEP não encontrado. Verifique o valor e tente novamente.'
          );
        }
      });
    }
  }

  validarCPF(control: AbstractControl) {
    let cpf = (control.value || '').replace(/\D/g, '');
    if (!cpf) return null;

    // Tamanho inválido
    if (cpf.length !== 11) return { cpfInvalido: true };

    // Verifica sequência repetida
    if (/^(\d)\1+$/.test(cpf)) return { cpfInvalido: true };

    // Validação dos dígitos verificadores
    let soma = 0,
      resto;
    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return { cpfInvalido: true };

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return { cpfInvalido: true };

    return null; // CPF válido!
  }

  validarDataNascimento(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const dataNascimento = control.value;
    if (dataNascimento && new Date(dataNascimento) > new Date()) {
      return { dataInvalida: true };
    }
    return null;
  }

  private validarFormulario(): void {
    Object.values(this.pessoaForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  // --- FUNÇÕES DE MÁSCARA NATIVA ---
  formatarCPF(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    event.target.value = value;
    this.pessoaForm.get('cpfPessoa')?.setValue(value, { emitEvent: false });
  }

  formatarTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    event.target.value = value;
    this.pessoaForm
      .get('telefone_pessoa')
      ?.setValue(value, { emitEvent: false });
  }

  formatarCEP(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    event.target.value = value;
    this.pessoaForm.get('cep_pessoa')?.setValue(value, { emitEvent: false });
  }

  formatarCPFValue(valor: string): string {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 11);
    return valor
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  formatarTelefoneValue(valor: string): string {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    if (valor.length <= 10) {
      // Formato (XX) XXXX-XXXX
      return valor
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      // Formato (XX) XXXXX-XXXX
      return valor
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
  }

  formatarCEPValue(valor: string): string {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    return valor.replace(/^(\d{5})(\d{0,3})/, '$1-$2').substring(0, 9);
  }

  validarTelefone(control: AbstractControl) {
    const raw = (control.value || '').replace(/\D/g, '');
    if (raw.length === 10 || raw.length === 11) {
      return null; // válido
    }
    return { telefoneInvalido: true };
  }

  cpfExistenteValidator(
    control: AbstractControl
  ): Observable<{ cpfExistente: true } | null> {
    const cpf = (control.value || '').replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) return of(null); // Só valida se formato ok

    // Não valida se for o mesmo CPF da edição
    if (
      this.pessoa &&
      this.pessoa.cpfPessoa &&
      cpf === this.pessoa.cpfPessoa.replace(/\D/g, '')
    ) {
      return of(null);
    }

    return this.pessoaService
      .cpfExiste(cpf)
      .pipe(map((existe: boolean) => (existe ? { cpfExistente: true } : null)));
  }
}
