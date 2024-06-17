import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage {
  email: string = '' // variable donde se asignaran los datos que vienen del input
  constructor(
    private userService: UserService,private router: Router,private toastController: ToastController) 
    {  }

 /**
  * @function onReset  
  * @descripción la función se ejecuta cuando el usuario hace click en el boton enviar y llama a la función resetPassword del servicio userService para enviar un correo para restablecer la contraseña.
  * Si la respuesta es exitosa, se le informa al usuario del envio de correo y se lo redirije a la pantalla de inicio de sesión. Y en caso de que haya un error lo informa al usuario.
  */
async onReset() {  
    try {
      await this.userService.resetPassword(this.email);      
      const toast = await this.toastController.create({ 
        message: 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.',
        duration: 3000,
        position: 'top',
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/login']); //Se lleva al usuario a la pantalla principal
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
      const toast = await this.toastController.create({ //Si hay error se crea otro Toast
        message: 'Ingrese un correo electrónico registrado válido',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }
}
