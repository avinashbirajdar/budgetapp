import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { entyBank } from 'src/entities/entyBank';
import { ApiService } from 'src/app/services/api.service';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.scss'],
})
export class BankComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  fgBank: FormGroup;
  banks: entyBank[] = [];
  bankid: number;

  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgBank = this.fb.group({
      BankName: ['', Validators.required],
      BranchName: ['', Validators.required],
      AccountNumber: ['', Validators.required],
      IFSC: ['', Validators.required],
      Amount: ['', Validators.required],
      IsActive: [true],
    });
  }

  ngOnInit(): void {
    this.GetAllBanks();
  }

  SaveBankDetails(): void {
    let bank = <entyBank>this.fgBank.value;

    this.http.CallPostApi('api/Bank', bank).subscribe(
      (res) => {
        this.alertify.success('Bank Added Successfully!!');
        //To Get New Added Bank
        this.GetAllBanks();
        this.fgBank.reset();
      },
      (err) => {
        this.alertify.error(err.error.ExceptionMessage);
      }
    );
  }

  GetAllBanks(): void {
    this.http.CallGetApi('api/Bank').subscribe(
      (res) => {
        this.banks = <entyBank[]>res;

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
      (err) => {
        this.alertify.error('Problem in fecthing banks');
        console.error(err);
      }

    );
  }

  DeleteBankDetails(): void {
    if (this.bankid != undefined) {
      this.http.CallDeleteApi('api/bank/', this.bankid).subscribe(
        (res) => {
          //To Get New Bank
          this.GetAllBanks();
          this.alertify.message('Bank Deleted');
        },
        (err) => {
          if (err.status == 404)
            this.alertify.error("Bank Not Found");
          else
            this.alertify.error("Eror In Deleteing Bank!!");
        }
      );
    }
  }

  SetDeleteBankId(id): void {
    document.getElementById('btnModl').click();
    this.bankid = id;
  }
}
