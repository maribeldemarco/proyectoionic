import { Component, OnInit } from '@angular/core';
import { Image } from '../home/home.page';
import { GlobalService } from 'src/services/global.service';
import { Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import { UserService } from 'src/services/user.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-mis-imagenes',
  templateUrl: './mis-imagenes.page.html',
  styleUrls: ['./mis-imagenes.page.scss'],
})
export class MisImagenesPage implements OnInit {
  myPicts: Image[] = [];
  myImages: boolean = true; //variable para saber si se muestran las imagenes o no.
  index: number = 0 ;//variable para saber el indice de la imagen que se va a eliminar  

  constructor(
    private userService: UserService,
    private router: Router,
    public GlobalService: GlobalService,
    private alertController: AlertController) {}

 
 
  ngOnInit() {
    // Cargar las imágenes al iniciar la página
    this.loadImages();
    // Observar los cambios en las imágenes del servicio UserService
    this.userService.imagesChanged.subscribe((images: Image[]) => {
      this.myPicts = images;
      this.myImages = this.myPicts.length > 0;
    });
  }

  /**
   *@function tomarFoto 
   *@descripcion La función abre la camara de fotos y toma una foto. En caso de que se guarde la foto, llama a la función saveImage del servicio UserService para guardar la imagen.
   *@param {Photo} image en caso de guardar la foto, se envia como parametro en la funcion saveImage.
   */
  async tomarFoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    const savedImage = await this.guardarFoto(image);
    if (savedImage) {
      this.userService.saveImage(savedImage); // Guardar la imagen en el servicio
    }
  }

  /**
   * @function guardarFoto
   * @descripcion la funcion guarda la foto en el dispositivo en formato base 64.
   * @param {Photo} image se envía la foto sacada por la camara.
   * @return {Promise <Image | null>} si es correcto devuelve el objeto Image, si no, devuelve null.
   */
  async guardarFoto(image: Photo): Promise <Image | null> {
    const fileName = new Date().getTime() + '.jpeg';
    try {
      const base64Data = await this.readAsBase64(image);
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents
      });
      return {
        src: { large: image.webPath ?? '' },
        photographer: "mis fotos"
      };
    } catch (error) {
      console.error('Error al guardar la foto:', error);
      return null;
    }
  }

   /**
   * @function readAsBase64
   * @descripcion la funcion lee la foto y la convierte en base 64. Utiliza la función fetch() para obtener la imagen, la convierte a un objeto Blob y luego la convierte a formato Base64 utilizando la función convertBlobToBase64(). El resultado final es una cadena Base64 que representa la imagen.
   * @param {any} image en caso de que se saque una foto con la camara se envia como parametro.
   * @return {Promise <string>} 
   */
  async readAsBase64(image: any) {
    try {
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    } catch (error) {
      console.error('Error al convertir la imagen a Base64:', error);
      throw error;
    }
  }

  /**
   * @function convertBlobToBase64
   * @descripcion la función utiliza FileReader para leer el contenido de un objeto Blob y lo convierte en una cadena Base64. 
   * @param {Blob} blob el objeto Blob que se va a convertir.
   * @return {Promise <string>} El resultado se devuelve como una promesa que resuelve en la cadena Base64.
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

  /**
  * @function subirImagen
  * @descripcion la función sube una imagen desde el dispositivo y crea un objeto Image con la informacion de la imagen. Llama a la función saveImage del servicio UserService para guardar la imagen.
  */  
  async subirImagen() {
    const image = await Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    const savedImage = {
      src: { large: image.webPath ?? '' },
      photographer: "mis fotos"
    };
    this.userService.saveImage(savedImage);
  }

  /**
  * @function onClick
  * @descripcion la función se encarga de cerrar la sesión. Llama la función logout del servicio GlobalService.
  */
  onClick() {
    this.GlobalService.logout().catch(error => console.log(error));
  }

  /**
  * @function isFavorite
  * @descripcion la funcion comprueba si una imagen está en favoritos. Llama a la función isFavorite del servicio GlobalService.
  * @param {Image} image la imagen que se va a comprobar.
  */
  isFavorite(image: Image) {
    return this.GlobalService.isFavorite(image);
  }

  /**
  * @function openImageModal  
  * @descripción la función se ejecuta cuando el usuario hace click en la imagen dentro de cada card. Llama a la función openImageModal del servicio GlobalService para abrir la imagen en el modal.
  * @param {string} imageUrl se pasa por parametro un string con el valor de la propiedad imageUrl de la imagen
  * @param {string} photographer se pasa por parametro tambien un string con el valor de la propiedad photographer de la imagen
  */
  openImageModal(imageUrl: string, photographer: string) {
    this.GlobalService.openImageModal(imageUrl, photographer);
  }

  /**
  * @function onCorazon  
  * @descripción la función se ejecuta cuando el usuario hace click en el icono de corazón dentro de cada card. Llama a la función onCorazon del servicio GlobalService.
  * @param {Image} image se pasa por parametro el objeto image.
  */
  onCorazon(image: Image) {
    this.GlobalService.onCorazon(image);
  }

  /**
  * @function loadImages  
  * @descripción se ejecuta cuando se incia el componente para cargar las imagenes desde la base de datos. Y suscribe a los cambios de la lista de imagenes.
  */
  private loadImages() {    
    this.userService.imagesChanged.subscribe((images: Image[]) => {
      this.myPicts = images;
    });
  }

  /**
  * @function confirmarizarFoto
  * @descripción se ejecuta cuando el usuario hace click en el icono de tacho de basura en la imagen. Crea un alert para confirmar la eliminación de la imagen. Si confirma, llama a la función eliminarFoto para eliminar la imagen.
  * @param {number} index el indice de la imagen que se va a eliminar. (el indice se crea cada vez que se crea renderiza una card)
  */
  async confirmarEliminarFoto(index: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta foto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirmación de eliminación cancelada');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.eliminarFoto(index);
          }
        }
      ]
    });

    await alert.present(); // muestra el alert para confirmar o cancelar
  }

  /**
  * @function eliminarFoto
  * @descripción elimina la foto cuyo indice se pasa por parametro del array de imagenes. Llama a la función deleteImage del servicio UserService para eliminar la imagen de Firebase.
  * @param {number} index el indice de la imagen que se va a eliminar. (el indice se crea cada vez que se crea renderiza una card)
  */
  eliminarFoto(index: number): void {
    this.myPicts.splice(index, 1);
    this.userService.deleteImage(index); 
    this.myImages = this.myPicts.length > 0; // Actualizar el estado de myImages, si es 0 no se muestran el contenedor de los cards
  }
}