import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../servicos/auth/auth.service';
import { Router } from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-signup-client',
  templateUrl: './signup-client.component.html',
  styleUrls: ['./signup-client.component.css']
})
export class SignupClientComponent {

  validateForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private notification: NzNotificationService,
    private router: Router){}

    ngOnInit(){
      this.validateForm = this.fb.group({
        email: [null, [Validators.email, Validators.required]],
        name: [null, [Validators.required]],
        sobrenome: [null, [Validators.required]],
        telefone: [null],
        senha: [null, [Validators.required]],
        checkSenha: [null, [Validators.required]],
      })
    }
    submitForm(){
      this.authService.registerClient(this.validateForm.value).subscribe(res=>{
        this.notification
        .success(
          'SUCCESS',
          'Signup sucessful',
          {nzDuration: 5000}
        );
        this.router.navigateByUrl('/login');
      }, error =>{
        this.notification
        .error(
          'ERROR',
          '${error.error}',
          {nzDuration: 5000}
        )
      });
    }

}
