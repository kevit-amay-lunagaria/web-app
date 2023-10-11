import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { __values } from 'tslib';

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
    { name: 'Reading', selected: false },
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
    let hobbies = [];
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
      hobbies = [];
      gender = this.dataFromEditForm.gender;
      address = this.dataFromEditForm.address;
      summary = this.dataFromEditForm.summary;

      if (this.selectedHobbies.length) {
        for (let i = 0; i < this.selectedHobbies.length; i++) {
          for (let j = 0; j < this.hobbies.length; j++) {
            if (this.selectedHobbies[i] === this.hobbies[j].name) {
              this.hobbies[j].selected = true;
            }
          }
        }
      }
    }

    this.userForm = new FormGroup({
      name: new FormControl(name, [Validators.required, this.noSpace]),
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
      Cricket: new FormControl(this.hobbies[0].selected, []),
      'PC Gaming': new FormControl(this.hobbies[1].selected, []),
      Reading: new FormControl(this.hobbies[2].selected, []),
      gender: new FormControl(gender, [Validators.required]),
      address: new FormControl(address, []),
      summary: new FormControl(summary, []),
    });
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

  noSpace(control: FormControl): { [s: string]: boolean } | null {
    if (control.value != null && control.value.indexOf(' ') !== -1) {
      return { noWhiteSpace: true };
    }
    return null;
  }

  onHobbyChange(event: Event, hobby: string, index: number) {
    if (!this.selectedHobbies.includes(hobby)) {
      this.selectedHobbies.push(hobby);
      this.hobbies[index].selected = true;
    } else {
      this.selectedHobbies.splice(this.selectedHobbies.indexOf(hobby), 1);
      this.hobbies[index].selected = false;
    }
  }

  onCancel() {
    if (this.allowEdit) {
      this.router.navigate(['/user-detail'], { relativeTo: this.route });
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
