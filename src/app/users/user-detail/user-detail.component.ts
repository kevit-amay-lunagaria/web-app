import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';

//export let browserRefresh: boolean = false;

@Component({
  selector: 'app-edit-user',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  hobbies: string[] = [];
  userData: any = [];
  showPercentSymbol: boolean = false;
  allowEdit: boolean = false;
  private subscription: Subscription | undefined;
  formEdited: boolean = true;
  name: string = '';
  dob: any;
  email: string = '';
  phonenumber: number = 0;
  institute: string = '';
  educationtype: string = '';
  percent: number = 0;
  gender: string = '';
  address: string = '';
  summary: string = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((qParams: any) => {
      this.formEdited = qParams.edited;
    });

    if (this.formEdited) {
      this.subscription = this.loginService
        .updatedUserData()
        .subscribe((data: any) => {
          this.userData = data[0];
          this.hobbies = data[1];
        });
    } else {
      this.subscription = this.loginService
        .showUserData()
        .subscribe((data: any) => {
          this.userData = data[0];
          this.hobbies = data[1];
        });
    }

    if (
      this.userData.education.percentage.toString().indexOf('.') === 2 ||
      (this.userData.education.percentage.toString().length <= 2 &&
        this.userData.education.percentage.toString().indexOf('0') != 0)
    ) {
      this.showPercentSymbol = true;
    } else {
      this.showPercentSymbol = false;
    }

    this.name = this.userData.name;
    this.dob = this.userData.dob;
    this.email = this.userData.email;
    this.phonenumber = this.userData.phonenumber;
    this.institute = this.userData.education.institute;
    this.educationtype = this.userData.education.educationtype;
    this.percent = this.userData.education.percentage;
    this.gender = this.userData.gender;
    this.address = this.userData.address;
    this.summary = this.userData.summary;
    this.userData = [];
  }

  toEdit() {
    this.allowEdit = true;
    const queryParams = {
      edit: this.allowEdit,
    };

    this.router.navigate(['/user'], { queryParams: queryParams });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
