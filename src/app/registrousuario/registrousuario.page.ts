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
        color: "secondary",
        duration: 4000, // Duración en milisegundos (en este caso, 4 segundos)
        position: 'top' //
      });

      await toast.present();

      // Redirigir al usuario a la página de inicio de sesión después de que el toast se haya mostrado
      toast.onDidDismiss().then(() => {
        this.router.navigate(['/login']);
      });
    })


      .catch(error => console.log(error));
      //Falta gestionar el error de mejor manera.
  }
}
