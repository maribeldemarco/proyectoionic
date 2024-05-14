import { Component } from '@angular/core';
import { UserService } from 'src/services/user.service';
import { GlobalService } from 'src/services/global.service';


export interface Image {
  src: { large: string };
  photographer: string;
}
@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage {

 
  

  constructor(
    private userService: UserService,
    public GlobalService: GlobalService, 
    
  ){  
      // Suscripción a los favoritos del service 
      this.userService.favoritesChanged.subscribe((favorites: Image[]) => {
      this.GlobalService.fav = favorites;
      });
    }
  ngOnInit() {
      // Carga los favoritos del service al cargar la página
      this.userService.initFavoritesFromDatabase(); 
  }

  onClick() {
    this.GlobalService.logout()
      .catch(error => console.log(error));
  }
  

  isFavorite(image: Image) {       
    return this.GlobalService.isFavorite(image);
  }   




  openImageModal(imageUrl: string, photographer: string) {
    this.GlobalService.openImageModal(imageUrl, photographer);
  }
  
  onCorazon(image:Image){
    this.GlobalService.onCorazon(image)
  }
  
}