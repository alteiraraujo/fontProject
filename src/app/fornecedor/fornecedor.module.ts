import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FornecedorRoutingModule } from './fornecedor-routing.module';
import { FornecedorFormComponent } from './fornecedor-form/fornecedor-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FornecedorComponent } from './fornecedor.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [
    FornecedorFormComponent,
    FornecedorComponent
  ],
  imports: [
    CommonModule,
    FornecedorRoutingModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzDatePickerModule,
    NzTypographyModule,
    NzInputNumberModule,
    NzInputModule,
    NzIconModule,
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzSwitchModule
    
  ]
})
export class FornecedorModule { }
