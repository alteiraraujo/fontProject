import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';




@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule
    
  ]
})
export class LoginModule { }
