import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { entyBank } from 'src/entities/entyBank';
import { entyWallet } from 'src/entities/entyWallet';
import { entyBankToWallet } from 'src/entities/entyBankToWallet';
import { Router } from '@angular/router';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';
@Component({
  selector: 'app-banktowallet',
  templateUrl: './banktowallet.component.html',
  styleUrls: ['./banktowallet.component.scss']
})

export class BanktowalletComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  fgbanktowallet: FormGroup;
  banks: entyBank[] = [];
  wallets: entyWallet[] = [];
  banktowallets: entyBankToWallet[] = [];
  bankwalletid: number;

  constructor(private fb: FormBuilder, private http: ApiService, private route: Router, private alertify: AlertifyService) {
    this.fgbanktowallet = fb.group({
      BankId: ['', Validators.required],
      WalletId: ['', Validators.required],
      Amount: ['', Validators.required],
      Description: ['', Validators.required],
      IsActive: [true]
    })
  }

  ngOnInit(): void {
    if (!localStorage.getItem('userToken')) {
      this.route.navigate(['/auth/login']);
    }
    console.log("session", localStorage.getItem('userToken'));
    this.GetAllBanks();
    this.GetWallets();
    this.GetBankToWallets();
  }

  SaveBankToWalletTransfer(): void {
    let banktowallets = <entyBankToWallet>this.fgbanktowallet.value;
    this.http.CallPostApi("api/banktowallet", banktowallets).subscribe(res => {
      this.alertify.success('Amount Transferred Successfully!!');
      this.GetBankToWallets();
      this.fgbanktowallet.reset();
    },
      err => {
        this.alertify.success('Error in Amount Transfer');
      })
  }

  GetAllBanks(): void {
    this.http.CallGetApi('api/Bank').subscribe(res => {
      this.banks = (<entyBank[]>res);

    }, err => {
      this.alertify.error('Error in fetching Banks');
    });
  }

  GetWallets(): void {
    this.http.CallGetApi('api/wallet').subscribe(res => {
      this.wallets = (<entyWallet[]>res);
    }, err => {
      this.alertify.error('Error in fetching wallets');
    });
  }

  GetBankToWallets(): void {
    this.http.CallGetApi('api/banktowallet').subscribe(res => {
      this.banktowallets = (<entyBankToWallet[]>res);

      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next();
      }

      // this.GetBankToWallets();

    }, err => {
      this.alertify.error('Error in fecthing Amount Transfer');
    });
  }


  DeletebanktowalletDetails(): void {
    if (this.bankwalletid != undefined) {
      this.http.CallDeleteApi('api/banktowallet/', this.bankwalletid).subscribe(res => {
        this.alertify.message('Amoubt Transfer Record Deleted');
        //To Get New Bank
        this.GetBankToWallets();
      }, err => {
        this.alertify.error('Error in Deleteing Record');
      });
    }
  }

  SetDeleteBtWId(id): void {
    this.bankwalletid = id;
    console.log("id", this.bankwalletid);
    if (this.bankwalletid) {
      document.getElementById('btnModl').click();
    }
  }
  ShowFullDescription(description) {
    document.getElementById('banktowallet_description').innerText = description;
  }
}
