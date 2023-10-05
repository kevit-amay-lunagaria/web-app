import { Component, Injectable, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
@Injectable()
export class LoginComponent {
  @ViewChild('f', { static: false }) loginForm: NgForm | undefined;
  username: string = '';
  userpassword: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {}

  onLogIn() {
    this.loginService.getNewUser(
      this.loginForm?.value.username,
      this.loginForm?.value.userpassword
    );
    this.authService.logIn();
    alert('looged in');
    // if (this.loginForm?.valid) {
    //   //this.authService.logIn();
    //   this.router.navigate(['/user'], { relativeTo: this.route });
    // }
  }
}
