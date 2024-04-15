import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { Router } from '@angular/router'; 
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {

  email: string = ''

  constructor(private userService: UserService,private router: Router,private toastController: ToastController) { }

  ngOnInit() {
  }

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
      this.router.navigate(['/login']);
    } catch (error: any) {       
      const errorCode = error.code;
      const errorMessage = error.message; 
      console.error(errorCode, errorMessage);
      const toast = await this.toastController.create({
        message: 'Ingrese un correo electrónico registrado válido',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();   
    }
  }
}