import { TipoDocumento } from './entity/tipoDocumento';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListusuariosComponent } from './component/listusuarios/listusuarios.component';
import { LoginusuariosComponent } from './component/loginusuarios/loginusuarios/loginusuarios.component';
import { CrudempresasComponent } from './component/crudempresas/crudempresas.component';
import { CrudestadocivilComponent } from './component/crudestadocivil/crudestadocivil.component';
import { CrudtipodocumentoComponent } from './component/crudtipodocumento/crudtipodocumento.component';
import { CrudTipoCuentaComponent } from './component/crudtipocuenta/crudtipocuenta.component';
import { CommonModule } from '@angular/common';
import { CrudroleComponent } from './component/crudrole/crudrole.component';
import { CrudmoduloComponent } from './component/crudmodulo/crudmodulo.component';
import { CrudopcionesComponent } from './component/crudopciones/crudopciones.component';
import { CrudmenuComponent } from './component/crudmenu/crudmenu.component';
import { MenuComponent } from './component/menu/menu.component';
import { CrudGeneroComponent } from './component/crudgenero/crud-genero.component';
import { CrudstatususuarioComponent } from './component/crudstatususuario/crudstatususuario.component';
import { CrudusuariosComponent } from './component/crudusuarios/crudusuarios.component';
import { AsignacionrolopcionComponent } from './component/asignacionrolopcion/asignacionrolopcion.component';
import { CrudsucursalesComponent } from './component/crudsucursales/crudsucursales.component';
import { CambiopasswordComponent } from './component/cambiopassword/cambiopassword.component';
import { CierreMesCRUDComponent } from './component/cierre-mes-crud/cierre-mes-crud.component';
import { GestionpersonasComponent } from './component/gestionpersonas/gestionpersonas.component';
import { MovimientosComponent } from './component/movimientos/movimientos.component';
import { TipoMovimientoCxcComponent } from './component/tipo-movimiento-cxc/tipo-movimiento-cxc.component';
import { CrudstatuscuentaComponent } from './component/crudstatuscuenta/crudstatuscuenta.component';
import { ConsultaSaldoComponent } from './component/consulta-saldo/consulta-saldo/consulta-saldo.component';
import { CuentaComponent } from './component/cuenta/cuenta.component';
import { DetalleCuentaComponent } from './component/detalle-cuenta/detalle-cuenta.component';

@NgModule({
  declarations: [
    AppComponent,
    ListusuariosComponent,
    LoginusuariosComponent,
    CrudempresasComponent,
    CrudroleComponent,
    CrudmoduloComponent,
    CrudmenuComponent,
    CrudopcionesComponent,
    MenuComponent,
    CrudGeneroComponent,
    CrudstatususuarioComponent,
    CrudusuariosComponent,
    AsignacionrolopcionComponent,
    CrudsucursalesComponent,
    CrudestadocivilComponent,
    CrudTipoCuentaComponent,
    CrudtipodocumentoComponent,
    CambiopasswordComponent,
    CierreMesCRUDComponent,
    GestionpersonasComponent,
    CambiopasswordComponent,
    MovimientosComponent,
    CierreMesCRUDComponent,
    TipoMovimientoCxcComponent,
    CrudstatuscuentaComponent,
    ConsultaSaldoComponent,
    CuentaComponent
  ],
bootstrap: [AppComponent],
imports: [
  BrowserModule,
  AppRoutingModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  CommonModule,
  DetalleCuentaComponent
],
providers: [
  provideHttpClient(withInterceptorsFromDi()),
  { provide: LOCALE_ID, useValue: 'es' }
]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeEs);
  }
}
