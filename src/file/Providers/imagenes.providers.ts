import { Imagen } from '../Entity/Imagen.entity';
export const imagenProviders = [
  {
    provide: 'IMAGENES_REPOSITORY',
    useValue: Imagen,
  },
];