import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css']
})
export class PessoaFormComponent {
  @Output() pessoaCadastrada = new EventEmitter<any>(); // Emite o dado da pessoa cadastrada
  @Output() cancelado = new EventEmitter<void>(); // Emite o evento de cancelamento

  pessoaForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.pessoaForm = this.fb.group({
      nome_pessoa: ['', [Validators.required]],
      cpf_pessoa: ['', [Validators.required, this.validarCPF]],
      data_nascimento_pessoa: [null, [Validators.required, this.validarDataNascimento]],
      telefone_pessoa: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      phoneNumberPrefix: ['+55'], // Prefixo padrão para o telefone
      complemento_pessoa: [''],
      cep_pessoa: ['', [Validators.required]],
      cidade_pessoa: [{ value: '', disabled: true }],
      estado_pessoa: [{ value: '', disabled: true }],
      uf_pessoa: [{ value: '', disabled: true }],
      rua_pessoa: [{ value: '', disabled: true }],
      bairro_pessoa: [{ value: '', disabled: true }],
      numero_pessoa: ['', Validators.required],
      genero_pessoa: ['']
    });
  }

  submitForm(): void {
    if (this.pessoaForm.valid) {
      const pessoaData = {
        ...this.pessoaForm.getRawValue(),
        status_pessoa: 'Ativo'
      };

      this.http.post('http://localhost:8080/pessoas', pessoaData).subscribe(
        (response) => {
          console.log('Pessoa cadastrada com sucesso:', response);
          this.pessoaCadastrada.emit(response); // Emite o evento para o componente pai
        },
        (error) => {
          console.error('Erro ao cadastrar pessoa:', error);
        }
      );
    } else {
      Object.values(this.pessoaForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  buscarCEP(): void {
    const cep = this.pessoaForm.get('cep_pessoa')?.value;
    if (cep) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (data && !data.erro) {
          this.pessoaForm.patchValue({
            cidade_pessoa: data.localidade,
            estado_pessoa: data.estado,
            rua_pessoa: data.logradouro,
            bairro_pessoa: data.bairro,
            uf_pessoa: data.uf
          });
        } else {
          alert('CEP não encontrado. Verifique o valor e tente novamente.');
        }
      });
    }
  }

  validarCPF(control: AbstractControl) {
    const cpf = control.value;
    if (!cpf) return null;
    const cpfValido = cpf.length === 11 && !/^(\d)\1+$/.test(cpf);
    return cpfValido ? null : { cpfInvalido: true };
  }

  validarDataNascimento(control: AbstractControl): { [key: string]: boolean } | null {
    const dataNascimento = control.value;
    if (dataNascimento && new Date(dataNascimento) > new Date()) {
      return { dataInvalida: true };
    }
    return null;
  }

  cancelar(): void {
    this.cancelado.emit(); // Emite o evento de cancelamento para o componente pai
  }
}
