import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pessoa-form',
  templateUrl: './pessoa-form.component.html',
  styleUrls: ['./pessoa-form.component.css']
})
export class PessoaFormComponent {

  pessoaForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.pessoaForm = this.fb.group({
      nome_pessoa: ['', [Validators.required]],
      cpf_pessoa: ['', [Validators.required, this.validarCPF]],
      data_nascimento_pessoa: [null, [Validators.required]],
      complemento_pessoa: [''],
      cep_pessoa: ['', [Validators.required]],
      cidade: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      rua: [{ value: '', disabled: true }],
      bairro: [{ value: '', disabled: true }],
      genero_pessoa: ['']
    });
  }

  submitForm(): void {
    if (this.pessoaForm.valid) {
      console.log('Dados do formulário:', this.pessoaForm.value);
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
        if (data) {
          this.pessoaForm.patchValue({
            cidade: data.localidade,
            estado: data.uf,
            rua: data.logradouro,
            bairro: data.bairro
          });
        }
      });
    }
  }

  // Validação de CPF simples
  validarCPF(control: any) {
    const cpf = control.value;
    if (!cpf) return null;
    // Exemplo básico de validação, substitua por uma função completa se necessário
    const cpfValido = cpf.length === 11 && !/^(\d)\1+$/.test(cpf);
    return cpfValido ? null : { cpfInvalido: true };
  }

}
