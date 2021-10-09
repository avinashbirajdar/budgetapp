import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { ApiService } from 'src/app/services/api.service';
import { DatatbleService } from 'src/app/services/datatble.service';
import { enty_IncomeType } from 'src/entities/enty_IncomeType';

@Component({
  selector: 'app-income-type',
  templateUrl: './income-type.component.html',
  styleUrls: ['./income-type.component.scss']
})

export class IncomeTypeComponent implements OnInit {
  fgincometype: FormGroup;
  incometype: enty_IncomeType[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();
  dtInstance: any;
  UserIncomeTypeId: number;

  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgincometype = this.fb.group({
      IncomeName: ['', Validators.required],
      IsActive: [true]
    });

  }

  ngOnInit(): void {
    this.GetIncomeType();
  }

  SaveUserIcomeType(): void {
    let income = (<enty_IncomeType>this.fgincometype.value);
    this.http.CallPostApi('api/incometype', income).subscribe(res => {
      this.alertify.success('Income Type Added!!');
      this.GetIncomeType();
      this.fgincometype.reset();
    },
      err => {
        this.alertify.error(err.error.ExceptionMessage);
      })
  }

  GetIncomeType(): void {

    this.http.CallGetApi('api/incometype').subscribe(res => {
      this.incometype = (<enty_IncomeType[]>res);

      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }
    },
      err => {
        this.alertify.error('Error in Fetching Income Type');
      })
  }

  SetDeleteItemId(id): void {
    this.UserIncomeTypeId = id;
    if (this.UserIncomeTypeId != null) {
      document.getElementById('btnModl').click();
    }
  }

  DeleteIncomeType() {
    this.http.CallDeleteApi('api/incometype/', this.UserIncomeTypeId).subscribe(res => {
      this.alertify.message('Credit Debit Record Deleted!!');
      //To Get Remaining Category
      this.GetIncomeType();
    },
      err => {
        this.alertify.error('Error In Deleting Income Type');
      }
    )
  }

}
