import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ListusuariosComponent } from './component/listusuarios/listusuarios.component';
import { LoginusuariosComponent } from './component/loginusuarios/loginusuarios/loginusuarios.component';
import { CrudempresasComponent } from './component/crudempresas/crudempresas.component';
import { CrudmenuComponent } from './component/crudmenu/crudmenu.component';
import { CrudopcionesComponent } from './component/crudopciones/crudopciones.component';
import { MenuComponent } from './component/menu/menu.component';
import { CrudmoduloComponent } from './component/crudmodulo/crudmodulo.component';
import { CrudroleComponent } from './component/crudrole/crudrole.component';
import { CrudestadocivilComponent } from './component/crudestadocivil/crudestadocivil.component';
import { CrudusuariosComponent } from './component/crudusuarios/crudusuarios.component';
import { AsignacionrolopcionComponent } from './component/asignacionrolopcion/asignacionrolopcion.component';
import { CrudGeneroComponent } from './component/crudgenero/crud-genero.component';
import { CrudstatususuarioComponent } from './component/crudstatususuario/crudstatususuario.component';
import { CrudtipodocumentoComponent } from './component/crudtipodocumento/crudtipodocumento.component';
import { CrudTipoCuentaComponent } from './component/crudtipocuenta/crudtipocuenta.component';
import { CrudsucursalesComponent } from './component/crudsucursales/crudsucursales.component';
import { CambiopasswordComponent } from './component/cambiopassword/cambiopassword.component';
import { CierreMesCRUDComponent } from './component/cierre-mes-crud/cierre-mes-crud.component';
import { MovimientosComponent } from './component/movimientos/movimientos.component';
import { TipoMovimientoCxcComponent } from './component/tipo-movimiento-cxc/tipo-movimiento-cxc.component';
import { CrudstatuscuentaComponent } from './component/crudstatuscuenta/crudstatuscuenta.component';
import { CuentaComponent } from './component/cuenta/cuenta.component';
import { ConsultaSaldoComponent } from './component/consulta-saldo/consulta-saldo/consulta-saldo.component';

import { GestionpersonasComponent } from './component/gestionpersonas/gestionpersonas.component';

const routes: Routes = [

  { path: 'crudempresas', component: CrudempresasComponent, canActivate: [AuthGuard] },
  { path: 'crudmenu', component: CrudmenuComponent, canActivate: [AuthGuard] },
  { path: 'crudmodulo', component: CrudmoduloComponent, canActivate: [AuthGuard] },
  { path: 'crudopciones', component: CrudopcionesComponent, canActivate: [AuthGuard] },
  { path: 'crudrole', component: CrudroleComponent, canActivate: [AuthGuard] },
  { path: 'listusuarios', component: ListusuariosComponent, canActivate: [AuthGuard] },
  { path: 'loginusuarios', component: LoginusuariosComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'crud-genero', component: CrudGeneroComponent },
  { path: 'crudstatususuario', component: CrudstatususuarioComponent },
  { path: 'crudusuarios', component: CrudusuariosComponent },
  { path: 'crudestadocivil', component: CrudestadocivilComponent, canActivate: [AuthGuard] },
  { path: 'crudtipodocumento', component: CrudtipodocumentoComponent, canActivate: [AuthGuard] },
  { path: 'crudtipocuenta', component: CrudTipoCuentaComponent, canActivate: [AuthGuard] },
  { path: 'asignacionrolopcion', component: AsignacionrolopcionComponent },
  { path: 'crudsucursales', component: CrudsucursalesComponent },
  { path: 'cambiopassword', component: CambiopasswordComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [AuthGuard] },
  { path: 'cierre-mes', component: CierreMesCRUDComponent, canActivate: [AuthGuard] },
  { path: 'tipo-movimiento-cxc', component: TipoMovimientoCxcComponent, canActivate: [AuthGuard] },
  { path: 'crudstatuscuenta', component: CrudstatuscuentaComponent, canActivate: [AuthGuard] },
  { path: 'cuenta', component: CuentaComponent, canActivate: [AuthGuard] },
  { path: 'consulta-saldo', component: ConsultaSaldoComponent, canActivate: [AuthGuard] },
  { path: 'gestionpersonas', component: GestionpersonasComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'loginusuarios', pathMatch: 'full' },
  { path: '**', redirectTo: 'menu', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
