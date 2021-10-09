import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiService } from 'src/app/services/api.service';
import { entyForgetPassword } from 'src/entities/entyForgetPassword';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent implements OnInit {

  fgPassword: FormGroup;
  id: string;
  ExpiraionTime: Time;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private http: ApiService, private alertify: AlertifyService) {
    this.fgPassword = this.fb.group({
      Password: [''],
      ConfirmPassword: ['']
    })
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.ExpiraionTime = this.route.snapshot.params.ExpirationTime;
    

    console.log(this.id + "/" + this.ExpiraionTime);
  }
  ForgetPassword() {
    let forgetpassword = (<entyForgetPassword>this.fgPassword.value);
    forgetpassword.UserId = this.id;

    console.log(forgetpassword);

    this.http.CallPostApi('api/Account/ChangePassword', forgetpassword).subscribe(res => {
      this.alertify.success('Password Reseted Successfully!');
      window.location.href = "/auth/login";
    }, error => {
      this.alertify.error('Password not reseted!')
    });
  }

}
