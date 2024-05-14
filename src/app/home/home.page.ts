import { Component } from '@angular/core';
import { GlobalService } from 'src/services/global.service';
import { UserService } from 'src/services/user.service';


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
  search: boolean = false;  
  

  constructor(
    private userService: UserService,
    public GlobalService: GlobalService,
    
  ){  
      // Suscripción a los favoritos del service 
      this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
      this.GlobalService.fav = favorites;
      });
    }

  ngOnInit(): void {
    // Carga los favoritos del service al cargar la página
    this.userService.initFavoritesFromDatabase(); 
  }

  onClick() {
    this.GlobalService.logout()
      .catch(error => console.log(error));
  }

  ionViewDidEnter() {    
    this.callLoadImages();
  }

  // Carga las imágenes llamando al servicio de la api que hace el fetch
 callLoadImages() {
  this.GlobalService.images = []; // Reinicializar la lista de imágenes
  this.GlobalService.loadImages(this.searchText);
  }

onSearchChange(event:any, searchText: string) {
    this.GlobalService.onSearchChange(event, this.searchText);
  }  


 loadMore() {   
      this.GlobalService.loadMore(this.searchText);    
  }  
   
  isFavorite(image: Image) {       
    return this.GlobalService.isFavorite(image);
  }    

  
  onCorazon(image:Image){
    this.GlobalService.onCorazon(image)
  }
  
  openImageModal(imageUrl: string, photographer: string) {
    this.GlobalService.openImageModal(imageUrl, photographer);
  }
}