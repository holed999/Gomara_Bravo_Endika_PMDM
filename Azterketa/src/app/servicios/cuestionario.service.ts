import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { IPregunta } from './../interfaces/interfaces';
import { GestionStorageService } from './gestion-storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CuestionarioService {
  // Array para almacenar todas las preguntas del json. Recordad inicializar el array para evitar problemas
  private preguntas: IPregunta[] = [];

  // Variable para controlar si ya se cargaron las preguntas en esta sesión
  private preguntasCargadasEnSesion: boolean = false;

  // Añadir los componentes y servicios que se necesitan
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private storageService: GestionStorageService
  ) {
    // Cargar los datos al iniciar el servicio
    this.recuperarPreguntas();
  }

  // Método que devolverá un array de IPregunta, es decir, todas las preguntas del cuestionario en un array
  getPreguntas(): IPregunta[] {
    return this.preguntas;
  }

  // Recupera las preguntas: SIEMPRE carga desde JSON al inicio, solo usa storage si ya hubo interacción en esta sesión
  async recuperarPreguntas() {
    // Si es la primera vez en esta sesión, cargar desde JSON y resetear
    if (!this.preguntasCargadasEnSesion) {
      console.log('Primera carga en esta sesión, leyendo desde JSON...');
      await this.leerDatosFicheroForzado();
      this.preguntasCargadasEnSesion = true;
    } else {
      // Si ya se cargaron antes en esta sesión, mantener los datos actuales
      console.log('Ya hay preguntas cargadas en esta sesión, manteniendo estado actual');
    }
  }

  // Lee los datos de un fichero y los almacena en un array (SIEMPRE resetea)
  private async leerDatosFicheroForzado(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Intentando leer fichero JSON (forzado)...');
      this.http.get<IPregunta[]>('assets/datos/datos.json').subscribe({
        next: (data) => {
          console.log('Datos leídos del JSON:', data);
          // Inicializar atributos que no están en el JSON (RESETEAR TODO)
          this.preguntas = data.map(pregunta => ({
            ...pregunta,
            respuestasIncorrectas: [],
            intentos: 0,
            acierto: false
          }));
          console.log('Preguntas procesadas y reseteadas:', this.preguntas);
          
          // Guardar en storage (pero solo el estado inicial)
          this.guardarPreguntas();
          resolve();
        },
        error: (error) => {
          console.error('Error al leer el fichero JSON:', error);
          reject(error);
        }
      });
    });
  }

  // Abre una alerta con el enunciado de la pregunta y comprueba la respuesta
  async mostrarAlerta(pregunta: IPregunta) {
    const alert = await this.alertController.create({
      header: 'Asmatu logotipoa',
      inputs: [
        {
          name: 'respuesta',
          type: 'text',
          placeholder: 'Sartu erantzuna'
        }
      ],
      buttons: [
        {
          text: 'Bidali',
          handler: (data) => {
            this.comprobarRespuesta(pregunta, data.respuesta);
          }
        }
      ]
    });

    await alert.present();
  }

  // Método auxiliar para comprobar la respuesta
  private comprobarRespuesta(pregunta: IPregunta, respuestaUsuario: string) {
    pregunta.intentos++;

    if (respuestaUsuario.trim().toLowerCase() === pregunta.respuesta.trim().toLowerCase()) {
      // Respuesta correcta
      pregunta.acierto = true;
    } else {
      // Respuesta incorrecta
      pregunta.acierto = false;
      if (!pregunta.respuestasIncorrectas.includes(respuestaUsuario)) {
        pregunta.respuestasIncorrectas.push(respuestaUsuario);
      }
    }

    // Guardar cambios en storage (esto mantiene el estado DURANTE la sesión)
    this.guardarPreguntas();
  }

  // Almacenar el array de preguntas en Storage
  async guardarPreguntas() {
    await this.storageService.setObject('preguntas', this.preguntas);
  }

  // Método opcional: para reiniciar manualmente si lo necesitas
  async reiniciarPreguntas() {
    this.preguntasCargadasEnSesion = false;
    await this.leerDatosFicheroForzado();
  }
}