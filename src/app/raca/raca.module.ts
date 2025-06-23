import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RacaRoutingModule } from './raca-routing.module';
import { RacaFormComponent } from './raca-form/raca-form.component';
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
import { RacaComponent } from './raca.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [
    RacaFormComponent, RacaComponent
  ],
  imports: [
    CommonModule,
    RacaRoutingModule,
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
    NzSwitchModule,
    NzModalModule,
    NzSpinModule
    
  ]
})
export class RacaModule { }
