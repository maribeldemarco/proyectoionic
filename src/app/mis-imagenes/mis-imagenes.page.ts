import { Component, OnInit } from '@angular/core';
import { Image } from '../home/home.page'
import { GlobalService } from 'src/services/global.service';
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { UserService } from 'src/services/user.service';
import { ApiService } from 'src/services/api.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mis-imagenes',
  templateUrl: './mis-imagenes.page.html',
  styleUrls: ['./mis-imagenes.page.scss'],
})
export class MisImagenesPage {
  myImages = false;
  myPicts: Image[] = [];
  fav: Image[] = []; 
  capturedImageUrl: string = '';   
  favImages:boolean=false;
  savedImageuri: any;
  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  async tomarFoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera 
    })    

    const fotoguardada = await this.guardarFoto(image);
     if(fotoguardada != null){
      const nuevaFoto: Image = {
        src: { large: fotoguardada.webviewPath ?? ''},
        photographer: "mis fotos"
      };
      // Agregar la foto al array
       this.myPicts.push(nuevaFoto); 
       this.myImages = true;       
     }        
  }
 

  async guardarFoto(image: any) {
    const fileName = new Date().getTime() + '.jpeg';    
    try {
        // Convierte la foto a formato base64
        const base64Data = await this.readAsBase64(image);        
        // Guarda el archivo
        const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        // Devuelve la información de la foto guardada
        return {
            filepath: fileName,
            webviewPath: image.webPath,
        };
    } catch (error) {
        console.error('Error al guardar la foto:', error);
        throw error;
    }
  }

  async readAsBase64(image: any) {
      try {       
          const response = await fetch(image.webPath!); // Obtiene la respuesta de la solicitud fetch de la foto guardada     
          const blob = await response.blob();// Convierte la respuesta a un objeto Blob       
          return await this.convertBlobToBase64(blob) as string;
      } catch (error) {
          console.error('Error al convertir la imagen a Base64:', error);
          throw error;
      }
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise(function(resolve, reject) {      
        const reader = new FileReader();// Crea un lector de archivos
        reader.onerror = function(event) {
            reject(event.target?.error);// Maneja los errores de lectura
        };  
        reader.onload = function() {
          resolve(reader.result as string);// Cuando la lectura se completa, resuelve la promesa con la cadena Base64
        };      
        reader.readAsDataURL(blob);// Lee el Blob como una URL de datos (cadena Base64)
    });
  }


  async subirImagen(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos // Abrir diálogo para seleccionar imagen de la galería
    });
   
    if(image.webPath){
    const imageUrl = image.webPath;
    console.log(imageUrl);
    const newImage: Image = {
      src: { large: imageUrl},
      photographer: "mis fotos"
    };
    // agrego la nueva imagen
    this.myPicts.push(newImage);   
    console.log('la lista de mis imagenes es: ', this.myPicts);    
    //renderiza las imagenes del array myPicts
    this.myImages =true;
    }
  }

  onClick() {
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

  isFavorite(image: Image): boolean {
    return this.fav.some((favImage: Image) => favImage.src.large === image.src.large);
  }
  onCorazon(image:Image){
    this.onImageClick(image)
  }
  onImageClick(image: Image) {
    // Primero se hace la modificación de favoritos de manera local en array fav  
    if (!this.fav.some((favimage: Image) => favimage.src.large === image.src.large)) {
      this.fav.push(image);
    }
    else {
      this.fav = this.fav.filter((favImage: Image) => favImage.src.large !== image.src.large);   
    }
    console.log('la lista de favoritos es: ', this.fav);
     
    // Luego se actualizan los favoritos en el servicio y se sincronizan con la base de datos
    this.userService.setFavorites(this.fav); 
    this.userService.synchronizeFavoritesWithDatabase() 
      .then(() => {
        console.log('Favoritos sincronizados con la base de datos.');
      })
      .catch(error => {
        console.error('Error al sincronizar los favoritos con la base de datos:', error);
      });
  }

}
