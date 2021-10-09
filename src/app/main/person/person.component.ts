import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { entyPerson } from 'src/entities/entyPerson';
import { ApiService } from 'src/app/services/api.service';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  PersonId: number;
  fgPerson: FormGroup;
  persons: entyPerson[] = [];
  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgPerson = this.fb.group({
      Name: ['', Validators.required],
      Email: ['', Validators.required],
      Mobile: ['', Validators.required],
      Address: ['', Validators.required],
      IsActive: true
    });
  }

  ngOnInit(): void {
    this.GetAllPeronDetails();
  }


  SavePersonDetails(): void {
    let person = (<entyPerson>this.fgPerson.value);

    this.http.CallPostApi('api/person', person).subscribe(res => {
      this.alertify.success('Person Added Successfully.');

      //To Get New Person Added
      this.GetAllPeronDetails();
      this.fgPerson.reset();
    }, err => {
      this.alertify.error(err.error.ExceptionMessage);
      console.error(err);
    });
  }
  GetAllPeronDetails(): void {
    this.http.CallGetApi('api/person').subscribe(res => {
      this.persons = (<entyPerson[]>res);
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    }, err => {
      this.alertify.error('Error In Fetcing Details.');
      console.error(err);
    });
  }


  SetDeleteItemId(id): void {
    this.PersonId = id;
    if (this.PersonId != null) {
      document.getElementById('btnModl').click();
    }
  }

  DeletePerson(): void {

    this.http.CallDeleteApi('api/person/', this.PersonId).subscribe(res => {
      this.alertify.message('Person deleted!!');
      //To Get Remaining Person
      this.GetAllPeronDetails();
    },
      err => {
        this.alertify.error('Error in Deleting Person!');
        console.log(err);
      }
    )
  }
}
