import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { PessoaRoutingModule } from './pessoa-routing.module';
import { PessoaFormComponent } from './pessoa-form/pessoa-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PessoaComponent } from './pessoa.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { TelefoneFormatadoPipe } from '../pipe/telefone-formatado.pipe';
import { CpfFormatadoPipe } from '../pipe/cpf-formatado.pipe';

@NgModule({
  declarations: [PessoaComponent, PessoaFormComponent, TelefoneFormatadoPipe,  CpfFormatadoPipe],
  imports: [
    CommonModule,
    PessoaRoutingModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzTypographyModule,
    NzInputNumberModule,
    NzInputModule,
    NzIconModule,
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzSwitchModule,
    NzSpinModule,
  ],
  providers: [provideNgxMask()],
})
export class PessoaModule {}
