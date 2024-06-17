import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Image } from '../home/home.page';
import Wallpaper from 'wallpaper-project';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
})
export class ImageModalComponent {

  @Input() image: Image = {} as Image

  constructor(
    private modalController: ModalController,
    private toastController: ToastController
  ) {} 

  /** 
  * @function closeModal 
  * @description Cierra el modal actual
  */
  closeModal() {
    this.modalController.dismiss();
  }
  
  /** 
  * @function setWallpaper 
  * @param image: Image
  * @description Establece una imagen en string base64 como fondo de pantalla utilizando el plugin Wallpaper
  */
  async setWallpaper(image: Image) {

    try {
      const base64Image = await this.readAsBase64(image);
      Wallpaper.setBase64 ({ base64Image }).then(async () => {
        const toast = await this.toastController.create({
          message: 'Fondo de pantalla establecido con éxito',
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        toast.present();
      }).catch(async error => {
        const toast = await this.toastController.create({
          message: 'Error al establecer fondo de pantalla',
          duration: 2000,
          position: 'top',
          color: 'danger'
        });
        toast.present();
      });
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al establecer fondo de pantalla',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      toast.present();
    }
  }

  /** 
  * @function readAsBase64
  * @param image: any
  * @description Accede a una imagen a través de su URL y la convierte a un string base64 utilizando el método convertBlobToBase64
  * @returns Promise<string>
  */
  async readAsBase64(image: any): Promise<string> {

    try {
      const response = await fetch(image.src.large);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;

    } catch (error) {
      console.error('Error al convertir la imagen a Base64:', error);
      throw error;
    }
  }

  /** 
  * @function convertBlobToBase64
  * @param blob: Blob
  * @description Convierte un objeto Blob a un string base64
  * @returns Promise<string>
  */
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function(event) {
        reject(event.target?.error);
      };
      reader.onload = function() {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}