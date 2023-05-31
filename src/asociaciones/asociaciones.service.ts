import { Inject, Injectable } from '@nestjs/common';
import { Asociaciones } from './entity/asociaciones.entity';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';


@Injectable()
export class AsociacionesService {
  constructor(
    @Inject('ASOCIACIONES_REPOSITORY')  // Inyectamos los providers de asociaciones
    private asociacionesProviders: typeof Asociaciones,
  ) { }

  async findAll(): Promise<Asociaciones[]> {  //funcion para retornar todas las asociaciones
    return this.asociacionesProviders.findAll({});
  }

  async findOne(id:string): Promise<Asociaciones> { // funcion que retorna una asociacion
    return this.asociacionesProviders.findOne({ where: { id } });
  }

  async create(body: CreateAsociacionDto) { // funcion para crear asociacion
    await this.asociacionesProviders.create({ ...body }); 
    return 'Asociacion creada correctamente';
  }

  async delete(id: string): Promise<string> { // funcion de borrado logico de asociaciones
    const asociacion = await this.asociacionesProviders.findOne({ where: { id } });
    if (asociacion) {
      asociacion.status = false;
    }
    await asociacion.save();
    return 'Asociacion eliminada correctamente';
  }
}