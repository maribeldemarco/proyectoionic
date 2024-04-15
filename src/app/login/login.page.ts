import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.login(this.formLogin.value)
      .then(response => {
        console.log(response);
        this.formLogin.reset(); //borrar los campos del form una vez logueado.       
        this.router.navigate(['/home']);       
      })
      .catch(async error => {
        console.log(error);
        const toast = await this.toastController.create({
          message: 'Correo electrónico o contraseña incorrectos',
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();        
      });
  }

  onClick() {
    this.userService.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error))
    }
}







