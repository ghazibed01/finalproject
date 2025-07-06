import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService, Role } from '@core';
import { StorageService } from '@core/service/storage.service';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
 // extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  
  authForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
 

  constructor(private authService: AuthService,
     private storageService: StorageService,
     private formBuilder: UntypedFormBuilder,
     private router: Router,
     private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }


    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: [ '',[Validators.required]]
    });
  }
  get f() {
    return this.authForm.controls;
  }

  onSubmit(): void {
    const { username, password } = this.authForm.value;
    
    this.authService.login(username, password).subscribe({
      next: data => {
        console.log('User reçu après login :', data);
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        console.log("login",this.roles);
        this.storageService.saveUser(data);
this.authService['currentUserSubject'].next(data);
        // Vérification des rôles de l'utilisateur et redirection en fonction du rôle
        if ( this.roles.includes(Role.Manager)) {
          this.router.navigate(['/admin/dashboard/dashboard2']);
          console.log("manager");
        } else if (this.roles.includes(Role.Rh)) {
          this.router.navigate(['/employee/dashboard']);
        } else if (this.roles.includes(Role.Employe)) {
          this.router.navigate(['/employee/dashboard']);
        } else {
          this.router.navigate(['/authentication/signin']);
        }
  
        this.loading = false;
      },
     

      error: err => {
        this.errorMessage = err?.error?.message || 'Username ou Mot de passe incorrect'; 
        this.isLoginFailed = true;
        this.loading = false;
        console.log("Erreur de connexion:", this.errorMessage);
        this.showNotification('black', this.errorMessage, 'top', 'right');}



    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  
}

  
