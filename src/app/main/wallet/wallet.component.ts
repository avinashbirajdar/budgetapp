import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { entyWallet } from 'src/entities/entyWallet';
import { ApiService } from 'src/app/services/api.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DatatbleService } from 'src/app/services/datatble.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  isDtInitialized = false;
  dtTrigger: Subject<any> = new Subject();

  walletid: number;
  fgwallet: FormGroup;
  wallets: entyWallet[] = [];
  @ViewChild('fileInput') fileInput;

  constructor(
    private fb: FormBuilder,
    private http: ApiService,
    private alertify: AlertifyService
  ) {
    this.fgwallet = fb.group({
      WalletName: ['', Validators.required],
      WalletIcon: ['', Validators.required],
      WalletAmount: ['', Validators.required],
      IsActive: [true],
    });
  }

  ngOnInit(): void {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   processing: true
    // };
    this.GetWallets();
  }

  SaveWallet(): void {
    let isSaved = 0;
    let wallet = <entyWallet>this.fgwallet.value;
    this.http.CallPostApi('api/wallet', wallet).subscribe(
      (res) => {
        isSaved = 1;
        this.UploadFile();
        this.alertify.success('Wallet Added Successfully!!');
        this.fgwallet.reset();
      },
      (err) => {
        this.alertify.error('Error in Adding Wallet');
        console.error(err);
      }
    );
  }

  GetWallets(): void {
    this.http.CallGetApi('api/wallet').subscribe(
      (res) => {
        this.wallets = <entyWallet[]>res;
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
        this.alertify.error('Error in Fetching Wallet!');
        console.error(err);
      }
    );
  }

  DeleteWalletDetails(): void {
    if (this.walletid != undefined) {
      this.http.CallDeleteApi('api/wallet/', this.walletid).subscribe(
        (res) => {
          //To Get New Remening Wallet
          this.alertify.message('Wallet Deleted!');
          this.GetWallets();
        },
        (err) => {
          this.alertify.error('Error in deleting wallet.');
          console.error(err);
        }
      );
    }
  }

  setwalletId(id): void {
    this.walletid = id;
    if (this.walletid != undefined) {
      document.getElementById('btnModl').click();
    }
  }

  UploadFile(): void {
    let fi = this.fileInput.nativeElement;
    let fileToUpload;
    if (fi.files && fi.files[0]) {
      fileToUpload = fi.files[0];
    }
    let input = new FormData();
    input.append('file', fileToUpload);

    this.http.CallPostFileApi('api/wallet/UploadWalletIcon', input).subscribe(
      (res) => {
        this.GetWallets();
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
