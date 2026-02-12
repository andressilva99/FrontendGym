export interface Trainer {
  _id: string;
  username: string;
  dni?: string;
}

export interface Socio {
  _id: string;
  apellido: string;
  nombre: string;
  fechaNacimiento: string;
  trainerId: Trainer | string;
}

export interface SocioFormData {
  apellido: string;
  nombre: string;
  fechaNacimiento: string;
  trainerId: string;
}