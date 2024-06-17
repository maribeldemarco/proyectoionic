import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  showPassword = false;
  formLogin: FormGroup; // se crea una propiedad de tipo formGroup que se vincula con el formulario de html 
  constructor( 
    private userService: UserService,
    private router: Router,
    private toastController: ToastController) //se inyectan componentes UserService y el manejo de Rutas de Angular con el ToastController que es un mensaje de alerta de Ionic
  {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    })
  }

  /**
  * @function onSubmit  
  * @descripción la función se ejecuta si el usuario toca el boton de ingresar, llama a la función login del servicio userService para iniciar con usuario y contraseña. En caso de recibir la respuesta y no hay errores resetea el formlario y avanza a tabs. ("home"). Si hay errores los captura y los informa por pantalla con un toast.
  * @param {FormGroup} formLogin se pasa los valores cargados en el objeto formlogin que lleva los datos ingresados por el usuario en el formulario.
  */
  onSubmit() { // 
    this.userService.login(this.formLogin.value)     
      .then(response => {   
        this.formLogin.reset(); 
        this.router.navigate(['/tabs/']);
      })
      .catch(async error => {
        console.log(error);
        const toast = await this.toastController.create({
          message: 'Correo electrónico o contraseña incorrectos',
          duration: 3000,
          position: 'top',
          color: 'danger'
        });
        await toast.present();       //se despliega en pantalla el mensaje de alerta
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







