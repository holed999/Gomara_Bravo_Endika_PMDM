import { Component, OnInit } from '@angular/core';
import { CuestionarioService } from './../servicios/cuestionario.service';
import { IPregunta } from './../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  preguntas: IPregunta[] = [];
  preguntaActual?: IPregunta;
  indicePreguntaActual: number = 0;

  constructor(private cuestionarioService: CuestionarioService) {}

  async ngOnInit() {
    // Cargar las preguntas al iniciar
    await this.cargarPreguntas();
  }

  async cargarPreguntas() {
    // Esperar a que se carguen las preguntas
    await this.cuestionarioService.recuperarPreguntas();
    
    // Pequeño delay para asegurar que los datos estén listos
    setTimeout(() => {
      this.preguntas = this.cuestionarioService.getPreguntas();
      console.log('Preguntas cargadas en home:', this.preguntas);
      if (this.preguntas.length > 0) {
        this.preguntaActual = this.preguntas[this.indicePreguntaActual];
        console.log('Pregunta actual:', this.preguntaActual);
      }
    }, 100);
  }

  // Método para gestionar el onclick de RESPONDER
  async responder(pregunta: IPregunta) {
    if (pregunta) {
      await this.cuestionarioService.mostrarAlerta(pregunta);
      // Actualizar la vista después de responder
      this.preguntas = this.cuestionarioService.getPreguntas();
      this.preguntaActual = this.preguntas[this.indicePreguntaActual];
    }
  }

  // Método para gestionar el onclick de Guardar
  guardar() {
    this.cuestionarioService.guardarPreguntas();
  }

}