import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { BankComponent } from './main/bank/bank.component';
import { PersonComponent } from './main/person/person.component';
import { CategoryComponent } from './main/category/category.component';
import { IncomeTypeComponent } from './main/income-type/income-type.component';
import { CreditDebitComponent } from './main/credit-debit/credit-debit.component';
import { WalletComponent } from './main/wallet/wallet.component';
import { BanktobankComponent } from './main/banktobank/banktobank.component';
import { BanktowalletComponent } from './main/banktowallet/banktowallet.component';
import { ExpensesComponent } from './main/expenses/expenses.component';
import { SubCategoryComponent } from './main/sub-category/sub-category.component';

import { ProfileComponent } from './main/profile/profile.component';

import { UserInfoComponent } from './main/UserInfo/UserInfo.component';
import { ForgetpasswordComponent } from './auth/forgetpassword/forgetpassword.component';
import { RecoverpasswordComponent } from './auth/recoverpassword/recoverpassword.component';
import { CreateuserprofileComponent } from './main/createuserprofile/createuserprofile.component';
import { ReportComponent } from './main/report/report.component';
const routes: Routes = [
  {
    path: 'user',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'banks',
        component: BankComponent
      },
      {
        path: 'person',
        component: PersonComponent
      },
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'incometype',
        component: IncomeTypeComponent
      },
      {
        path: 'creditdebit',
        component: CreditDebitComponent
      },
      {
        path: 'wallet',
        component: WalletComponent
      },
      {
        path: 'banktobank',
        component: BanktobankComponent
      },
      {
        path: 'banktowallet',
        component: BanktowalletComponent
      },
      {
        path: 'expenses',
        component: ExpensesComponent
      },
      {
        path: 'subcategory',
        component: SubCategoryComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'createprofile',
        component: CreateuserprofileComponent
      },
      {
        path: 'report',
        component: ReportComponent
      },
      {
        path: '', redirectTo: '/dashboard', pathMatch: 'full'
      }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegistrationComponent
      },
      {
        path: 'recoverpassword',
        component: RecoverpasswordComponent
      }
    ]
  },
  {
    path: 'forgetpassword/:id/:ExpirationTime',
    component: ForgetpasswordComponent
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
