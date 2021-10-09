import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiService } from 'src/app/services/api.service';
import { entyRecoverPassword } from 'src/entities/entyRecoverPassword';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.component.html',
  styleUrls: ['./recoverpassword.component.scss']
})
export class RecoverpasswordComponent implements OnInit {

  fgResetUserPassword: FormGroup;

  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgResetUserPassword = this.fb.group({
      Email: ['', Validators.required]
    });
  }

  ngOnInit() {

  }

  ResetPassword(): any {
    console.log(this.fgResetUserPassword.value);
    let resetpassword = (<entyRecoverPassword>this.fgResetUserPassword.value);
    console.log(resetpassword);

    this.http.CallPostApi('api/resetpassword', resetpassword).subscribe(res => {
      this.alertify.success('Reset Link Is Send Successfully!')
    }, error => {
      this.alertify.error('Error in sending reset link');
    });
  }

}


