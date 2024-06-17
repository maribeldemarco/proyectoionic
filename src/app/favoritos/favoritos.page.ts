import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { GlobalService } from 'src/services/global.service';
import { Image } from '../home/home.page';


@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage {  

  constructor(
    private userService: UserService,
    public GlobalService: GlobalService)     // se inyectan los servicios de estos componentes para usarlos
  {  
    // Suscripción a los favoritos del service 
    this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
    this.GlobalService.fav = favorites;
    });
  }
  ngOnInit() {
      // Carga los favoritos del service al cargar la página
      this.userService.initFavoritesFromDatabase(); 
  }
  
  /**
  * @function onClick  
  * @descripción la función se ejecuta cuando el usuario hace click en el ícono de log-out. Llama a la función logout del servicio GlobalService
  */
  onClick() {
    this.GlobalService.logout()
      .catch(error => console.log(error));
  }

  /**
  * @function isFavorite  
  * @descripción la función se ejecuta cada vez que se renderiza una card, y asigna el icono y la clase que corresponda al elemento ion-icon. Llama a la función isFavorite del servicio GlobalService para validar si la imagen está dentro de los favoritos
  * @param {Image} image se pasa por parametro el objeto image
  * @return {boolean} devuelve un boleano que indica si la imagen se encuentra en el array de imagenes favoritas
  */
  isFavorite(image: Image) {       
    return this.GlobalService.isFavorite(image);
  }   
  
  /**
  * @function openImageModal  
  * @descripción la función se ejecuta cuando el usuario hace click en la imagen dentro de cada card. Llama a la función openImageModal del servicio GlobalService para abrir la imagen en el modal
  * @param {string} imageUrl se pasa por parametro un string con el valor de la propiedad imageUrl de la imagen
  * @param {string} photographer se pasa por parametro tambien un string con el valor de la propiedad photographer de la imagen
  */
  openImageModal(imageUrl: string, photographer: string) {
    this.GlobalService.openImageModal(imageUrl, photographer);
  }
  
  /**
  * @function onCorazon  
  * @descripción la función se ejecuta cuando el usuario hace click en el icono de corazón dentro de cada card. Llama a la función onCorazon del servicio GlobalService.
  * @param {Image} image se pasa por parametro el objeto image
  */
  onCorazon(image:Image){
    this.GlobalService.onCorazon(image)
  }
}