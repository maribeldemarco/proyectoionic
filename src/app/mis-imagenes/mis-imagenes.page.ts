import { Component, OnInit } from '@angular/core';
import { Image } from '../home/home.page'
import { GlobalService } from 'src/services/global.service';
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import { UserService } from 'src/services/user.service';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mis-imagenes',
  templateUrl: './mis-imagenes.page.html',
  styleUrls: ['./mis-imagenes.page.scss'],
})
export class MisImagenesPage {

  myPicts: Image[] = [];

  capturedImageUrl: string = '';   
  favImages:boolean=false;
  savedImageuri: any;
  constructor(
    private userService: UserService,  
    private router: Router,
    public GlobalService: GlobalService
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
    }
  }
  onClick() {
    this.GlobalService.logout()
      .catch(error => console.log(error));
  }

  isFavorite(image: Image) {       
    return this.GlobalService.isFavorite(image);
  }   
  onCorazon(image:Image){
    this.GlobalService.onCorazon(image)
  } 

}
