import { Injectable } from "@angular/core";
import { Image } from "src/app/home/home.page";
import { UserService } from "./user.service";
import { ApiService } from "./api.service";
import { Router } from "@angular/router";
import { ModalController } from '@ionic/angular';
import { ImageModalComponent } from "src/app/image-modal/image-modal.component";
@Injectable({
    providedIn: 'root'
  })
  export class GlobalService {  
  images: Image[] = [];
  page_num: number = 1;
  per_page: number = 14; 
  loading: boolean = true;
  fav: Image[] = []; 
  favImages:boolean=false;
  defaultImages:boolean=true;
  busqueda:boolean = true;
  favoritos: boolean=false;
  buscar: boolean= true;    
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private apiService: ApiService, 
    private modalController: ModalController) { }

  /**
  * @function logout
  * @descripción la función llama a la función logout del servicio userService para cerrar la sesión. Luego redirije a la pantalla de inicio de sesión. 
  */  
  async logout() {
    try {
      await this.userService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
  * @function loadImages
  * @descripción la función llama a la función loadImages del servicio apiService para cargar las imagenes. Luego las concatena en un array images. 
  * @param {string} searchText envia por parametro searchText el valor de la busqueda
  */ 
  async loadImages(searchText: string) {
    try {
      this.loading = true;
      const response = await this.apiService.loadImages(searchText, this.page_num, this.per_page);
      this.images = this.images.concat(response.photos);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching images:', error);
      this.loading = false;
    }
  }

  /**
  * @function onSearchChange
  * @descripción la función es un controlador de eventos. Inicializa el array de imagenes en vacio, el numero de pagina en 1, el loading en true y llama a la función loadImagespara cargar las imagenes.
  * @param {string} searchText envia por parametro searchText el valor de la busqueda
  */ 
  onSearchChange(event: any, searchText: string) {
    this.images = [];
    this.page_num = 1;
    this.loading = true;
    this.loadImages(searchText);    
  }

   /**
  * @function loadMore
  * @descripción la función carga una nueva tanda de imagenes. Incrementa en 1 el valor de la variable page_num y llama a la función loadImages para cargar las imagenes.
  * @param {string} searchText envia por parametro searchText el valor de la busqueda
  */ 
  loadMore(searchText: string) {
    this.page_num++;
    this.loadImages(searchText);
  }

  /**
  * @function isFavorite  
  * @descripción la función valida si la imagen está dentro del array de favoritos.
  * @param {Image} image se pasa por parametro el objeto image
  * @return {boolean} devuelve un boleano que indica si la imagen se encuentra en el array de imagenes favoritas
  */
  isFavorite(image: Image): boolean {
    return this.fav.some((favImage: Image) => favImage.src.large === image.src.large);
  }

  /**
  * @function onCorazon  
  * @descripción La función gestiona la logica de favoritos al hacer click en el icono de corazon de las imagenes. Si la imagen no se encuentra en el array de favoritos, la imagen se agrega al array de favoritos. Si la imagen ya se encuentra en el array de favoritos, la imagen se elimina del array de favoritos. Luego gestiona llama a las funciones setFavorites y synchronizeFavoritesWithDatabase para sincronizar los favoritos con la base de datos de Firebase.
  * @param {Image} image se pasa por parametro el objeto image 
  */
  onCorazon(image:Image){ 
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

  /**
  * @function openImageModal
  * @descripción la función crea un modal para mostrar la imagen seleccionada en pantalla.
  * @param {string} imageUrl se pasa por parametro un string con el valor de la propiedad imageUrl de la imagen seleccionada
  * @param {string} photographer se pasa por parametro un string con el valor de la propiedad photographer de la imagen seleccionada 
  */
  async openImageModal(imageUrl: string, photographer: string) {
    const modal = await this.modalController.create({
      component: ImageModalComponent,
      componentProps: {
        image: { src: { large: imageUrl }, photographer: photographer }, 
        
      }
    });
    return await modal.present();
  }  

  }

  

 