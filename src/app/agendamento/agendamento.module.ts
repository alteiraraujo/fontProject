import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { AgendamentoRoutingModule } from './agendamento-routing.module';
import { AgendamentoComponent } from './agendamento.component';
import { AgendamentoFormComponent } from './agendamento-form/agendamento-form.component';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AgendamentoDetalhesComponent } from './agendamento-detalhes/agendamento-detalhes.component';




@NgModule({
  declarations: [AgendamentoComponent, AgendamentoFormComponent, AgendamentoDetalhesComponent],
  imports: [
    CommonModule,
    AgendamentoRoutingModule,
    NzCalendarModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzMessageModule,
    NzDatePickerModule 
  ],
  providers: [DatePipe],
})
export class AgendamentoModule {}
