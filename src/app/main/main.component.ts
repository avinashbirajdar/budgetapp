import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  constructor(private http: ApiService, private route: Router) { }

  ngOnInit(): void {
    if (!localStorage.getItem('userToken')) {
      this.route.navigate(['/auth/login']);
    }
  }

  logout() {
    localStorage.removeItem('userToken');
    this.route.navigate(['/auth/login']);
  }
}
