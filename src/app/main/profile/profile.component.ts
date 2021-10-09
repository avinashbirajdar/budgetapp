import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { entyUserProfile } from 'src/entities/entyUserProfile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userprofile: entyUserProfile[] = [];

  constructor(private http: ApiService) { }

  ngOnInit(): void {
    this.GetUserProfile();
  }

  GetUserProfile(): any {
    this.http.CallGetApi('api/userprofile').subscribe(res => {
      this.userprofile = (<entyUserProfile[]>res);
      console.log(this.userprofile);
    })
  }
}
