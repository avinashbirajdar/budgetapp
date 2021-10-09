import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { BankComponent } from './main/bank/bank.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { config } from './services/config';
import { NgSelect2Module } from 'ng-select2';
import { NgSelectModule } from '@ng-select/ng-select';

import { RouterModule } from '@angular/router';
import { PersonComponent } from './main/person/person.component';
import { CategoryComponent } from './main/category/category.component';
import { IncomeTypeComponent } from './main/income-type/income-type.component';
import { CreditDebitComponent } from './main/credit-debit/credit-debit.component';
import { WalletComponent } from './main/wallet/wallet.component';
import { BanktobankComponent } from './main/banktobank/banktobank.component';
import { BanktowalletComponent } from './main/banktowallet/banktowallet.component';
import { ExpensesComponent } from './main/expenses/expenses.component';
import { SubCategoryComponent } from './main/sub-category/sub-category.component';
import { DataTablesModule } from 'angular-datatables';
import { DatatbleService } from './services/datatble.service';
import { AlertifyService } from './services/alertify.service';
import { ForgetpasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { RecoverpasswordComponent } from './auth/recoverpassword/recoverpassword.component';
import { CreateuserprofileComponent } from './main/createuserprofile/createuserprofile.component';
import { ProfileComponent } from './main/profile/profile.component';
import { ReportComponent } from './main/report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    AuthComponent,
    DashboardComponent,
    LoginComponent,
    RegistrationComponent,
    BankComponent,
    PersonComponent,
    CategoryComponent,
    IncomeTypeComponent,
    CreditDebitComponent,
    WalletComponent,
    BanktobankComponent,
    BanktowalletComponent,
    ExpensesComponent,
    SubCategoryComponent,
    ForgetpasswordComponent,
    RecoverpasswordComponent,
    CreateuserprofileComponent,
    ProfileComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    NgSelect2Module,
    DataTablesModule,
    NgSelectModule
  ],
  providers: [ApiService, DatatbleService, config, AlertifyService],
  bootstrap: [AppComponent],
})
export class AppModule { }
