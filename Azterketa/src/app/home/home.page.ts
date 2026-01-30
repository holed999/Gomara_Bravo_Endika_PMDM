import { Component } from '@angular/core';
import { CuestionarioService } from './../servicios/cuestionario.service';
import { IPregunta } from './../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  //Importar servicio
  constructor() {}

  //Crear método para gestionar el onclick de RESPONDER
  //Recibirá un IPregunta y llamará al servicio para realizar las operaciones necesarias.

  //Crear método para gestionar el onclick de Guardar
  //No recibe parámetros y llamará al servicio para realizar las operaciones necesarias.


}
