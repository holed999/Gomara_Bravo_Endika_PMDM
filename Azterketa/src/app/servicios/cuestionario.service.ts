import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IPregunta } from './../interfaces/interfaces';
import { Observable } from 'rxjs';
import { GestionStorageService } from './gestion-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {
  // Array para almacenar todas las preguntas del json. Recordad inicializar el array para evitar problemas

  //Añadir los componentes y servicios que se necesitan
  constructor() {
    //Cargar los datos
  }

  // Método que devolverá un array de IPregunta, es decir, todas las preguntas del cuestionario en un array


  // Recupera las preguntas de Storage. Si no hay ninguna almacenada, las lee del fichero
  // Controlar la asincronía.


  // Lee los datos de un fichero y los almacena en un array


  // Abre una alerta con el enunciado de la pregunta y comprueba la respuesta
  // 1- En función de si es correcta o no, actualiza el estado de acierto.
  // 2- Si no se acierta:
  // 2.1- Restará el valor de los intentos
  // 2.2- Guardará el valor añadido en el array respuestasIncorrectas


  // Almacenar el array de preguntas en Storage

}
