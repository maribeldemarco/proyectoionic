import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

      /* Se definen las rutas para las pestañas definidas en el componente html de tabs.
      Las pestañas son home, favoritos e imagenes*/
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },

      /*carga el módulo 'favoritos.module' cuando se activa y lleva al usuario a la página de favoritos.
      Este enfoque se utiliza para cargar módulos de manera diferida (lazy loading), lo que significa que el módulo sera llamado cuando el usuario decida
      */
      {
        path: 'favoritos', // es la URL relativa que se corresponde con este componente
        loadChildren: () => import('../favoritos/favoritos.module').then(m => m.FavoritosPageModule)
      },
      {
        path: 'mis-imagenes',
        loadChildren: () => import('../mis-imagenes/mis-imagenes.module').then(m => m.MisImagenesPageModule)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
