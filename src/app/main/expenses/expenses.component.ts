import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { entyExpenses } from 'src/entities/entyExpenses';
import { entyCategory } from 'src/entities/entyCategory';
import { ApiService } from 'src/app/services/api.service';
import { entyWallet } from 'src/entities/entyWallet';
import { entyBank } from 'src/entities/entyBank';
import { enty_PaymentMethod } from 'src/entities/enty_PaymentMethod';
import { Options } from 'select2';
import { entySubCategory } from 'src/entities/entySubcategory';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  fgExpenses: FormGroup;
  expenses: entyExpenses[] = [];
  category: entyCategory[] = [];
  wallets: entyWallet[] = [];
  banks: entyBank[] = [];
  paymentmethod: enty_PaymentMethod[] = [];
  subcategory: entySubCategory[] = [];

  SelectedCategoryId: number;
  WalletId: number;
  BankId: number;
  SubCategoryId: number;
  ExpenseId: number = null;

  public options: Options;
  SelectedPaymentType: string;
  isWallet: boolean = false;
  constructor(private fb: FormBuilder, private http: ApiService, private alertify: AlertifyService) {
    this.fgExpenses = this.fb.group({
      DOT: ['', Validators.required],
      CategoryId: ['', Validators.required],
      Amount: ['', Validators.required],
      Description: ['', Validators.required],
      PaymentType: ['', Validators.required],
      PaymentMethodId: [''],
      SubCategoryId: ['', Validators.required],
      IsActive: [true]
    });
  }

  ngOnInit(): void {

    // this.fgExpenses.get('PaymentMethod').disable();
    this.fgExpenses.get('PaymentMethodId').disable();
    this.GetAllCategory();
    this.GetExpenses();
  }

  GetAllCategory(): void {
    this.http.CallGetApi('api/category').subscribe(res => {
      this.category = (<entyCategory[]>res);
    },
      err => {
        this.alertify.error('Error In Detching Data');
      })
  }


  SaveExpense(): void {

    let expense = <entyExpenses>this.fgExpenses.value;
    expense.WalletId = this.WalletId;
    expense.BankId = this.BankId;
    expense.SubCategoryId = this.fgExpenses.get('SubCategoryId').value;

    this.http.CallPostApi('api/expense', expense).subscribe(res => {
      this.GetExpenses();
      this.alertify.success('Expense Added Successfully!!');
      this.fgExpenses.reset();
    },
      err => {
        console.log(err);
        this.alertify.error("Error While Adding Expense");
      });
  };

  GetExpenses(): void {
    this.http.CallGetApi("api/expense").subscribe(res => {
      this.expenses = res;
      console.log(res);
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
        this.alertify.error('Error In Fetching Expense');
      });
  }

  changePaymentType(): void {
    // this.SelectedPaymentType = e.target.value;    
    this.banks = null;
    this.wallets = null;

    if (this.SelectedPaymentType == "Wallet") {
      this.http.CallGetApi("api/wallet").subscribe(res => {
        this.fgExpenses.get('PaymentMethodId').enable();
        this.wallets = res;
        this.isWallet = true;
      },
        err => {
          console.log(err);
        });
    } else if (this.SelectedPaymentType == "Account") {
      this.http.CallGetApi("api/bank").subscribe(res => {

        //To bind banks to dropdownlist dynamically on chage event
        this.banks = res;
        this.isWallet = false;

        //To Enable Dropdownlist
        this.fgExpenses.get('PaymentMethodId').enable();

      }, err => {
        console.log(err);
      });
    }
    else {
      this.WalletId = null;
      this.BankId = null;
      this.fgExpenses.get('PaymentMethodId').disable();
    }
  }

  SelectedPaymentMethod(): void {
    this.BankId = null;
    this.WalletId = null;

    if (this.isWallet == true) {
      this.WalletId = this.fgExpenses.get('PaymentMethodId').value;
      this.BankId = null;
    }
    else {
      this.BankId = this.fgExpenses.get('PaymentMethodId').value;
      this.WalletId = null;
    }
  }

  SetDeleteItemId(deleteitemid): void {
    this.ExpenseId = deleteitemid;
    if (this.ExpenseId != null) {
      document.getElementById('btnModl').click();
    }
  }

  DeleteExpense(): void {
    this.http.CallDeleteApi('api/expense/', this.ExpenseId).subscribe(res => {
      this.GetExpenses();
      this.alertify.error("Expense Deleted!!!!!");
    },
      err => {
        console.log(err);
      })
  }

  getsubcategory() {
    this.http.CallGetByIdApi('api/subcategory/', this.SelectedCategoryId).subscribe(res => {
      this.subcategory = <entySubCategory[]>res;

    }, error => {
      this.alertify.error('Error In Fetching Data');
    }
    )
  }

  ShowFullDescription(description) {
    document.getElementById('expense_description').innerText = description;
  }


}
