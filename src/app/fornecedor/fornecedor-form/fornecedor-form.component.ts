import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Fornecedor } from '../fornecedor';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.css']
})
export class FornecedorFormComponent {

  fornecedorForm: FormGroup;

  @Input() fornecedor?: Fornecedor;
  @Input() modo!: 'cadastrar' | 'editar' | 'abrir';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.fornecedorForm = this.fb.group({
      nome_fornecedor: ['', [Validators.required]],
      cnpj_fornecedor: ['', [Validators.required]],
      ie_fornecedor: [''],
      cep_fornecedor: ['', [Validators.required]],
      rua_fornecedor: [{ value: '', disabled: true }],
      numero_fornecedor: ['', Validators.required],
      complemento_fornecedor: [''],
      bairro_fornecedor: [{ value: '', disabled: true }],
      cidade_fornecedor: [{ value: '', disabled: true }],
      estado_fornecedor: [{ value: '', disabled: true }],
      uf_fornecedor: [{ value: '', disabled: true }],
      status_fornecedor: ['Ativo', Validators.required]
    });
  }

  submitForm(): void {
    if (this.fornecedorForm.valid) {
      const fornecedorData = this.fornecedorForm.getRawValue();
      console.log('Dados do formulário:', fornecedorData);
    } else {
      Object.values(this.fornecedorForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
    }
  }

  buscarCEP(): void {
    const cep = this.fornecedorForm.get('cep_fornecedor')?.value;
    if (cep) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe((data: any) => {
        if (data && !data.erro) {
          this.fornecedorForm.patchValue({
            rua_fornecedor: data.logradouro,
            bairro_fornecedor: data.bairro,
            cidade_fornecedor: data.localidade,
            estado_fornecedor: data.uf,
            uf_fornecedor: data.uf
          });
        } else {
          alert('CEP não encontrado. Verifique o valor e tente novamente.');
        }
      });
    }
  }


}
