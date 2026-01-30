// Se usa un entero para controlar el estado de la pregunta: 
// 0- No contestada
// 1-Respuesta correcta
// <0: Respuesta incorrecta (número de fallos)
// respuestasIncorrectas: Array que contendrá los valores incorrectas introducidas
// intentos: intentos realizados
// acierto: True en caso de haber acertado
export interface IPregunta {
  logotipo: string;
  respuesta: string;
  //No existen en el json
  respuestasIncorrectas: string[];
  intentos: number;
  acierto: boolean;
}
