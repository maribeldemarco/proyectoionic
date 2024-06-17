import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registrousuario',
  templateUrl: './registrousuario.page.html',
  styleUrls: ['./registrousuario.page.scss'],
})
export class RegistrousuarioPage {
  showPassword = false;
  formReg: FormGroup; // se crea una variable de tipo Formgroup

  constructor(
    private userService : UserService,
    private router: Router,
    private toastController: ToastController) //se inyectan dependencias
  {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    }) //se usa FormGroup de Angular para almacenar email y password
  }

  /**
  * @function onSubmit 
  * @descripción la función se ejecuta cuando el usuario hace click en el boton enviar del formulario de registro. Llama a la funcion register del servicio userService para registrar al usuario. Si el registro es exitoso, luego de mostrar la confirmación de registro, redirige al usuario a la página de inicio de sesión. Si hay un error lo informa a traves de un toast.
  */
  onSubmit() { 
    this.userService.register(this.formReg.value)
    .then(async response => {     
      const toast = await this.toastController.create({// Crea la alerta de registro exitoso
        message: '¡Registro exitoso!',
        color: "success",
        duration: 2000, // Duración en milisegundos (en este caso, 2 segundos)
        position: 'top'
      }); 
      await toast.present(); // informa el registro exitoso al usuario
    
      toast.onDidDismiss().then(() => {
        this.router.navigate(['/login']);
      });
    })
    .catch(async error => {
      let mensajedeError: string = '';
      if (error.code === 'auth/email-already-in-use') {
        mensajedeError = 'Este correo electrónico ya está en uso';
      } else if (error.code === 'auth/invalid-email') {
          mensajedeError = 'Correo electrónico inválido';
      } else if (error.code === 'auth/weak-password') {
          mensajedeError = 'La contraseña debe tener al menos 6 caracteres';
      }
      const toast = await this.toastController.create({
        message: mensajedeError,
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();// informa el error al usuario
    });
  }

  /**
  * @function togglePasswordVisibility  
  * @descripción la función se ejecuta cuando se dispara alguno de los eventos asociados (touchstart, touchend, o mouseleave) si el usuario pone para ver la contraseña. Cambia la visibilidad del input de password a text y viceversa.
  */
  togglePasswordVisibility(show: boolean) {
    this.showPassword = show;
  }

}
