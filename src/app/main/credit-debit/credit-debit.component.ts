import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { entyCreditDebit } from 'src/entities/entyCreditDebit';
import { ApiService } from 'src/app/services/api.service';
import { entyPerson } from 'src/entities/entyPerson';
import { enty_IncomeType } from 'src/entities/enty_IncomeType';
import { entyBank } from 'src/entities/entyBank';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-credit-debit',
  templateUrl: './credit-debit.component.html',
  styleUrls: ['./credit-debit.component.scss']
})
export class CreditDebitComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('person') personref: ElementRef;
  fgcreditdebit: FormGroup;
  creditdebit: entyCreditDebit[] = [];
  creditdebitbyid: entyCreditDebit[] = [];
  persons: entyPerson[] = [];
  incometype: enty_IncomeType[] = [];
  creditdebitid: number;
  isreturn: boolean;
  crdrId: number = null;
  SelectedPaymentMethod: string;

  IsReturnAmount: boolean = false;//For Return Amount To person from that i recived amount
  banks: entyBank[] = [];

  constructor(private fb: FormBuilder, private http: ApiService, private route: Router, private alertify: AlertifyService) {
    this.fgcreditdebit = this.fb.group({
      PersonId: ['', Validators.required, Validators.min(1)],
      IncomeTypeId: ['', Validators.required, Validators.min(1)],
      DOT: ['', Validators.required],
      Amount: ['', Validators.required],
      Description: ['', Validators.required],
      PaymentMethod: ['', Validators.required],
      Transaction: ['', Validators.required],
      BankId: ['', Validators.required],
      IsReturnable: [''],
      IsActive: [true]
    })
  }

  ngOnInit(): void {
    if (!localStorage.getItem('userToken')) {
      this.route.navigate(['/auth/login']);
    }

    this.GetAllPeronDetails();
    this.GetIncomeType();
    this.GetCreditDebit();
    this.GetAllBanks();
    this.isreturn = false;
  }

  GetAllPeronDetails(): void {
    this.http.CallGetApi('api/person').subscribe(res => {
      this.persons = (<entyPerson[]>res);
    }, err => {
      this.alertify.error('Error in fetching person details');
    });
  }

  GetIncomeType(): void {

    this.http.CallGetApi('api/incometype').subscribe(res => {
      this.incometype = (<enty_IncomeType[]>res);
      console.log(this.incometype);
    },
      err => {
        this.alertify.error('Error in fetching income types');
      })
  }

  SaveCreditDebit(): void {
    let isretutnable = this.fgcreditdebit.get('IsReturnable').value;
    let transactiontype = this.fgcreditdebit.get('Transaction').value;

    let creditdebit = <entyCreditDebit>this.fgcreditdebit.value;
    creditdebit.Transaction = transactiontype;
    creditdebit.PaymentMethod = this.SelectedPaymentMethod;
    console.log(creditdebit);
    if (isretutnable == true && transactiontype == "Credit") {
      creditdebit.IsReturnable = 1;
    }
    else {
      creditdebit.IsReturnable = 0;
    }
    this.http.CallPostApi('api/creditdebit', creditdebit).subscribe(res => {
      this.GetCreditDebit();
      if (transactiontype == "Credit")
        this.alertify.success('Your Account Is Credit!!');
      else if (transactiontype == "Debit")
        this.alertify.success('Your Account Is Debited!!');

      //this.fgcreditdebit.reset();
    },
      err => {
        this.alertify.error('Error during Transaction');
      }
    )
  }


  GetCreditDebit(): void {

    this.http.CallGetApi('api/creditdebit').subscribe(res => {
      this.creditdebit = (<entyCreditDebit[]>res);
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
      this.alertify.error('Error in fetching credit debit details.');
    });
  }

  GetCreditDenitDetailsById(creditdebitid): void {

    this.http.CallGetApi('api/creditdebit/' + creditdebitid).subscribe(res => {
      this.creditdebitbyid = (<entyCreditDebit[]>res);
      console.log(this.creditdebit);
    }, err => {
      this.alertify.error('Error in fetching credit debit details.');
      console.error(err);
    });
  }

  GetAllBanks(): void {

    this.http.CallGetApi('api/Bank').subscribe(res => {
      this.banks = (<entyBank[]>res);

      console.log("Bank", this.banks);
    }, err => {
      this.alertify.error('Error in fetching bank.');
    });
  }


  DeleteCreditDebitDetails(): void {
    if (this.creditdebitid != undefined) {
      this.http.CallDeleteApi('api/bank/', this.creditdebitid).subscribe(res => {
        this.alertify.message("Record Deleted!!");
        //To Get New Bank
        this.GetCreditDebit();
      }, err => {
        this.alertify.error('Error in deleteing record');
        console.error(err);
      });
    }
  }

  SetDeleteBankId(id): void {
    document.getElementById('btnModl').click();
    this.creditdebitid = id;
  }

  checkreturn(_transactiontype): void {
    if (_transactiontype == "Credit") {
      this.isreturn = true;
    }
    else {
      this.isreturn = false;
    }
  }

  ReturnAmount(PersonId, CreditDebitId): void {
    this.IsReturnAmount = true;
    this.crdrId = CreditDebitId;

    this.persons = null;
    this.GetSelectedReturnAmountPerson(PersonId);
    this.personref.nativeElement.focus();
  }

  GetSelectedReturnAmountPerson(PersonId): void {
    this.http.CallGetByIdApi('api/person/', PersonId).subscribe(res => {
      this.persons = (<entyPerson[]>res);

      this.fgcreditdebit.controls['PersonId'].setValue(PersonId);

    }, err => {
      console.log(err);
    });
  }

  SaveReturnAmount(): void {

    let creditdebit = <entyCreditDebit>this.fgcreditdebit.value;
    creditdebit.CreditDebitId = this.crdrId;
    this.http.CallPostApi('api/personreturnamount', creditdebit).subscribe(res => {
      this.GetCreditDebit();
      this.alertify.success('Person Amount Returned successfully!!');
      this.IsReturnAmount = false;

      this.fgcreditdebit.reset();
    },
      err => {
        this.alertify.error('Something wnet wrong!');
      }
    )
  }

  SetDeleteItemId(id): void {
    this.creditdebitid = id;
    if (this.creditdebitid != null) {
      document.getElementById('btnModl').click();
    }
  }

  DeleteCreditDebit() {
    this.http.CallDeleteApi('api/creditdebit/', this.creditdebitid).subscribe(res => {
      this.alertify.message('Credit Debit Record Deleted!!');
      //To Get Remaining Category
      this.GetCreditDebit();
    },
      err => {
        this.alertify.error('Error In Deleting Category');
      }
    )
  }
}
