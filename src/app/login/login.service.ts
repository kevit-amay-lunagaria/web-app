import { of } from 'rxjs';

export class LoginService {
  private users: string[] = [];
  private userData: any[] = [];

  getNewUser(username: string, password: string) {
    this.users.push(username);
    this.users.push(password);
  }

  showNewUser() {
    return this.users;
  }

  getUserData(values: any, hobbies: string[]) {
    this.userData.push(values);
    this.userData.push(hobbies);
  }

  showUserData() {
    const data = of(this.userData);
    return data;
  }

  updateUserData(values: any, hobbies: string[]) {
    this.userData.length = 0;
    this.userData.push(values);
    this.userData.push(hobbies);
  }

  updatedUserData() {
    const data = of(this.userData);
    return data;
  }
}
