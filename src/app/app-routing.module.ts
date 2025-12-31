import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path:'login', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {path:'booking',
    canActivate:[AuthGuard],
    loadChildren:()=> import('./features/booking/booking.module').then(m=>m.BookingModule)
  },
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'**',redirectTo:'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
