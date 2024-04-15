import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/services/user.service';
import { ToastController } from '@ionic/angular';



@Component({
  selector: 'app-registrousuario',
  templateUrl: './registrousuario.page.html',
  styleUrls: ['./registrousuario.page.scss'],
})
export class RegistrousuarioPage implements OnInit {

  formReg: FormGroup;

  constructor(

    private userService : UserService,
    private router: Router,
    private toastController: ToastController  ){
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.userService.register(this.formReg.value)
    .then(async response => {
      // Mostrar la alerta de registro exitoso
      const toast = await this.toastController.create({
        message: '¡Registro exitoso!',
        color: "success",
        duration: 2000, // Duración en milisegundos (en este caso, 4 segundos)
        position: 'top' //
      });

      await toast.present();

      // Redirigir al usuario a la página de inicio de sesión después de que el toast se haya mostrado
      toast.onDidDismiss().then(() => {
        this.router.navigate(['/login']);
      });
    })

      //Falta gestionar el error de mejor manera.
      .catch(async (error) => {
        let MensajedeError = '';
        if (error.code === 'auth/email-already-in-use') {
          MensajedeError = 'Este correo electrónico ya está en uso.';
        } else if (error.code === 'auth/invalid-email') {
          MensajedeError = 'Correo electrónico inválido.';
        } else if (error.code === 'auth/weak-password') {
          MensajedeError = 'La contraseña debe tener al menos 6 caracteres.';
        }

        const errorToast = await this.toastController.create({
          message: MensajedeError,
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        await errorToast.present();
      });

    }
}
