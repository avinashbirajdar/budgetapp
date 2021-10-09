import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { entyRegistration } from 'src/entities/entyRegistration';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  fgUserRegistartion: FormGroup;
  UserRegistration: entyRegistration[] = [];
  constructor(private fb: FormBuilder, private http: ApiService) {
    this.fgUserRegistartion = this.fb.group({
      Email: ['', Validators.required],
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log(this.UserRegistration);
  }

  UserRegistartion(): void {

    let User = (<entyRegistration>this.fgUserRegistartion.value);
    this.http.CallPostApi('api/Account/Register', User).subscribe(res => {
      alert('Registration  Completed Successfully.')
    },
      err => {
        alert('Something Went Wrong.');
        console.error(err);
      }
    )
  }

}
