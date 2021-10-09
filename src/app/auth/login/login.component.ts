import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { entyUserAuthentication } from 'src/entities/entyUserAuthentication';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  fgUserAuthentication: FormGroup;
  userAuthentication: entyUserAuthentication[] = [];

  constructor(private fb: FormBuilder, private http: ApiService, private route: Router) {
    this.fgUserAuthentication = this.fb.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    console.log(localStorage.getItem('userToken'))
    if (localStorage.getItem('userToken')) {
      this.route.navigate(['/user/dashboard']);
    }

  }

  UserAuthentication(): void {
    let sp = new URLSearchParams();
    sp.set('grant_type', 'password');
    sp.set('username', this.fgUserAuthentication.get('UserName').value);
    sp.set('password', this.fgUserAuthentication.get('Password').value);

    console.log(sp);
    this.http.CallPostAuthApi('Token', (sp.toString())).subscribe((res: any) => {
      localStorage.setItem('userToken', res.access_token);
      if (localStorage.getItem('userToken')) {
        //this.route.navigate(['/user/dashboard']);
        window.location.href = "/user/dashboard";
      }
    },
      err => {
        alert('Invalid UserName or Password.');
        console.error(err);
      }
    );
  }

}
