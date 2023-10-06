import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent
  implements OnInit, CanComponentDeactivate, OnDestroy
{
  userName: string = '';
  userPassword: string = '';
  userArray: string[] = [];
  genders: string[] = ['Male', 'Female'];
  hobbies: any[] = [
    { name: 'Cricket', selected: false },
    { name: 'PC Gaming', selected: false },
    { name: 'Reading Books', selected: false },
  ];
  userForm: any;
  selectedHobbies: string[] = [];
  allowEdit: boolean = false;
  dataFromEditForm: any;
  formSubmitted: boolean = false;
  checkBoxChecked: boolean = false;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userArray = this.loginService.showNewUser();
    this.userName = this.userArray[0];
    this.userPassword = this.userArray[1];

    this.route.queryParams.subscribe((qParams: any) => {
      if (qParams.edit !== undefined) {
        this.allowEdit = qParams.edit;
      }
      this.initForm();
    });
  }

  private initForm() {
    let name = '';
    let dob = '';
    let email = '';
    let phonenumber = '';
    let institute = '';
    let educationtype = '';
    let percentage = '';
    let hobbies = '';
    let address = '';
    let summary = '';
    let gender = '';

    if (this.allowEdit) {
      this.loginService.showUserData().subscribe((data: any) => {
        this.dataFromEditForm = data[0];
        this.selectedHobbies = data[1];
      });

      name = this.dataFromEditForm.name;
      dob = this.dataFromEditForm.dob;
      email = this.dataFromEditForm.email;
      phonenumber = this.dataFromEditForm.phonenumber;
      institute = this.dataFromEditForm.education.institute;
      educationtype = this.dataFromEditForm.education.educationtype;
      percentage = this.dataFromEditForm.education.percentage;
      hobbies = hobbies;
      gender = this.dataFromEditForm.gender;
      address = this.dataFromEditForm.address;
      summary = this.dataFromEditForm.summary;
    }

    this.userForm = new FormGroup({
      name: new FormControl(name, Validators.required),
      dob: new FormControl(dob, [Validators.required]),
      email: new FormControl(email, [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]),
      phonenumber: new FormControl(phonenumber, [Validators.required]),
      education: new FormGroup({
        institute: new FormControl(institute, [Validators.required]),
        educationtype: new FormControl(educationtype, [Validators.required]),
        percentage: new FormControl(percentage, [
          Validators.required,
          this.percentLength,
        ]),
      }),
      hobbies: new FormControl(null, []),
      gender: new FormControl(gender, [Validators.required]),
      address: new FormControl(address, []),
      summary: new FormControl(summary, []),
    });

    if (this.allowEdit) {
      for (let i = 0; i < this.hobbies.length; i++) {
        if (this.selectedHobbies[i] === this.hobbies[i].name) {
          this.hobbies[i].selected = true;
          console.log(this.hobbies[i]);
        }
      }
    }
    console.log(this.hobbies, '--outside for loop');
  }

  percentLength(control: FormControl): { [s: string]: boolean } | null {
    if (
      (control.value != null &&
        (control.value.toString().length > 5 ||
          control.value.toString().length < 2)) ||
      control.value.toString().indexOf('.') < 1 ||
      control.value.toString().indexOf('.') > 2
    ) {
      return { noProperFormat: true };
    }
    return null;
  }

  onHobbyChange(event: Event, hobby: string, index: number) {
    if (!this.selectedHobbies.includes(hobby)) {
      this.selectedHobbies.push(hobby);
      this.hobbies[index].selected = true;
    } else {
      this.selectedHobbies.splice(index, 1);
      this.hobbies[index].selected = false;
    }
  }

  onCancel() {
    if (this.allowEdit) {
      this.router.navigate(['/user-detail']);
    } else {
      this.userForm.reset();
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.formSubmitted = true;
      if (this.allowEdit) {
        this.loginService.updateUserData(
          this.userForm.value,
          this.selectedHobbies
        );
        const queryParams = { edited: true };
        this.router.navigate(['/user-detail'], { queryParams: queryParams });
      } else {
        this.loginService.getUserData(
          this.userForm.value,
          this.selectedHobbies
        );
        this.router.navigate(['/user-detail'], { relativeTo: this.route });
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  handleReload($event: any) {
    return ($event.returnValue = 'Your changes will not be saved');
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.allowEdit) {
      return true;
    }
    if (this.allowEdit && !this.formSubmitted) {
      this.formSubmitted = false;
      return confirm('Are you sure, you want to discard the changes?');
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {}
}
