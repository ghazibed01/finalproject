import { Injectable } from '@angular/core';


const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})


export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }
static getToken() : any{
  return localStorage.getItem(USER_KEY);
}
static getUsername(): any {
  const user = this.getU();
  if ( user == null){ return '';}
 return user.username
}
static getUseremail(): any {
  const user = this.getU();
  if ( user == null){ return '';}
 return user.email
}
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
static getUserId(): any {
  const user = this.getU();
  if ( user == null){ return '';}
 return user.id
}
static getU(): any {
  const user = window.sessionStorage.getItem(USER_KEY);
  if (user) {
    return JSON.parse(user);
  }

  return {};
}
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
  public Username(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {user};
  }
  public removeUser(): void {
    window.sessionStorage.removeItem(USER_KEY);
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }



}
