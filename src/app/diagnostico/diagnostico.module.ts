import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { DiagnosticoComponent } from './diagnostico.component';
import { DiagnosticoFormComponent } from './diagnostico-form/diagnostico-form.component';
import { DiagnosticoRoutingModule } from './diagnostico-routing.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [DiagnosticoComponent, DiagnosticoFormComponent],

  imports: [
    DiagnosticoRoutingModule,
    CommonModule,
    NzSpinModule,
    NzModalModule,
    NzSwitchModule,
    NzDividerModule,
    NzTableModule,
    FormsModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzTypographyModule,
    NzDatePickerModule,
    NzButtonModule,
    NzSelectModule,
    NzFormModule,
    ReactiveFormsModule,
    NzPaginationModule,
    NzImageModule,
    NzMessageModule
  ],
})
export class DiagnosticoModule {}
