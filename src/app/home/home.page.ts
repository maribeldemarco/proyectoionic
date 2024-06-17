import { Component } from '@angular/core';
import { GlobalService } from 'src/services/global.service';
import { UserService } from 'src/services/user.service';

// se crea interface Image, que será la estructura de datos con la que se trabajaran las imagenes dentro de la app
export interface Image {
  src: { large: string };
  photographer: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchText: string = "";  


  constructor(
    private userService: UserService, 
    public GlobalService: GlobalService)// se inyectan los servicios de estos componentes para usarlos
  {
    // Suscripción a los favoritos del service
    this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
    this.GlobalService.fav = favorites;
    });
  }

  ngOnInit(): void {
    // Carga los favoritos del service al cargar la página
    this.userService.initFavoritesFromDatabase();
  }

  /**
  * @function onClick  
  * @descripción la función se ejecuta cuando el usuario hace click en el ícono de log-out. Llama a la función logout del servicio GlobalService
  */
  onClick() { //Llama a la funcion Log Out en el componente o servicio Globalservice
    this.GlobalService.logout()
      .catch(error => console.log(error));
  }

  /**
  * @function ionViewDidEnter  
  * @descripción esta función es un evento de ionic que se ejecuta cada vez que la vista se muestra, a diferencia de ngOnInit() que solo se muestra cuando se inicializa el componente. Llama a la función callLoadImages()
  */
  ionViewDidEnter() {    
    this.callLoadImages();
  }

  /**
  * @function callLoadImages  
  * @descripción se ejecuta cada vez que el evento ionViewDidEnter se dispara. Reinicializa la lista de imagenes y llama a la función loadImage() del servicio GlobalService que maneja la carga de imagenes.
  */
  callLoadImages() {
  this.GlobalService.images = []; 
  this.GlobalService.loadImages(this.searchText);
  }

  /**
  * @function onSearchChange  
  * @descripción la función es un controlador de eventos del componente searchbar. Llama a la función onSearchChange del servicio GlobalService.
  * @param {any} event recibe el evento que la dispara. (cambia el contenido de la barra de busqueda)
  * @param {string} searchText y recibe tambien la variable searchText con los datos que tiene actualmente la barra de busqueda.
  */
  onSearchChange(event:any, searchText: string) {  
    this.GlobalService.onSearchChange(event, this.searchText);
  }

  /**
  * @function loadMore 
  * @descripción la función se ejecuta cada vez que se hace click en el botón para cargar más imagenes. Llama a la funcion loadMore del servicio GlobalService para la carga de otra tanda más de imagenes.
  */
  loadMore() {   
      this.GlobalService.loadMore(this.searchText);
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
  * @function onCorazon  
  * @descripción la función se ejecuta cuando el usuario hace click en el icono de corazón dentro de cada card. Llama a la función onCorazon del servicio GlobalService.
  * @param {Image} image se pasa por parametro el objeto image.
  */
  onCorazon(image:Image){ 
    this.GlobalService.onCorazon(image)
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
}
