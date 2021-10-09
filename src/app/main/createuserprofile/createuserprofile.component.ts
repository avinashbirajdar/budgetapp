import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiService } from 'src/app/services/api.service';
import { entyUserProfile } from 'src/entities/entyUserProfile';

declare var $: any;
@Component({
  selector: 'app-createuserprofile',
  templateUrl: './createuserprofile.component.html',
  styleUrls: ['./createuserprofile.component.scss']
})
export class CreateuserprofileComponent implements OnInit {
  @ViewChild('ProfilePic') ProfilePic;

  fguserprofile: FormGroup;

  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fguserprofile = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Profession: ['', Validators.required],
      Profile: ['', Validators.required],
      Day: ['', Validators.required],
      Month: ['', Validators.required],
      Year: ['', Validators.required],
      DOB: [''],
      Bio: ['', Validators.required],
      Address: ['', Validators.required],
      Location: ['', Validators.required],
      Phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    $(() => {
      $('.dropify').dropify({
        messages: { 'default': 'Click to Upload or Drag n Drop', 'remove': '<i class="flaticon-close-fill"></i>', 'replace': 'Upload or Drag n Drop' }
      });
    });

  }

  SaveProfile(): any {

    let userprofile = (<entyUserProfile>this.fguserprofile.value);
    let datestring = this.fguserprofile.get('Day').value + '/' + this.fguserprofile.get('Month').value + '/' + this.fguserprofile.get('Year').value;
    let dob = new Date(datestring);
    userprofile.DOB = dob;

    this.http.CallPostApi('api/userprofile', userprofile).subscribe(res => {

      this.UploadFile();
    }, error => {

    });
  }
  UploadFile(): void {
    alert();

    let fi = this.ProfilePic.nativeElement;
    let fileToUpload;
    if (fi.files && fi.files[0]) {
      fileToUpload = fi.files[0];
    }
    let input = new FormData();
    input.append("file", fileToUpload);
    this.http.CallPostFileApi('api/userprofile/UploadUserProfile', input).subscribe(res => {
      this.alertify.success('User Profile Created Successfuly!!');
    },
      err => {
        console.log(err);
      }
    )
  }
}
