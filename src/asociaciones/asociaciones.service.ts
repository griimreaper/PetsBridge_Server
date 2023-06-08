import { Inject, Injectable } from '@nestjs/common';
import { Asociaciones } from './entity/asociaciones.entity';
import { CreateAsociacionDto } from './dto/create-asociacion.dto';
import { HttpStatus } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class AsociacionesService {
  constructor(
    @Inject('ASOCIACIONES_REPOSITORY')  // Inyectamos los providers de asociaciones
    private asociacionesProviders: typeof Asociaciones,
  ) { }

  async findAll(): Promise<Asociaciones[]> {  //funcion para retornar todas las asociaciones
    return this.asociacionesProviders.findAll({});
  }

  async findOne(id: string): Promise<Asociaciones> { // funcion que retorna una asociacion
    return this.asociacionesProviders.findOne({ where: { id } });
  }

  async create(body: CreateAsociacionDto ): Promise<{ send: string; status: number }> { // funcion para crear asociacion
    const { email } = body;
    if (await Users.findOne({ where: { email } })) return { send:'El email ya esta en uso.', status: HttpStatus.BAD_REQUEST };
    const [asociacion, created] = await this.asociacionesProviders.findOrCreate({ where: { email }, defaults: { ...body } });
    if (!created) return { send:'El email ya esta en uso.', status: HttpStatus.BAD_REQUEST };
    return { send:'La asociacion se creo exitosamente.', status: HttpStatus.CREATED };
  }

  async delete(id: string): Promise<string> { // funcion de borrado logico de asociaciones
    const asociacion = await this.asociacionesProviders.findOne({ where: { id } });
    if (asociacion) {
      asociacion.status = false;
    }
    await asociacion.save();
    return 'Asociacion eliminada correctamente';
  }

  async update(id: string, { name, country, description, password, address }: CreateAsociacionDto, img_profile?: any): Promise<string> {
    if (!name && !country && !description && !password && !img_profile) return 'Nada que actualizar';
    const asociacion = await this.asociacionesProviders.findOne({ where: { id } });
    if (asociacion) {
      if (name) asociacion.name = name;
      if (country) asociacion.country = country;
      if (img_profile) asociacion.img_profile = img_profile;
      if (description) asociacion.description = description;
      if (address) asociacion.address = address;
      if (password) {
        const hashedPassword = await hash(password, 10);
        asociacion.password = hashedPassword;
      }
      await asociacion.save();
      return 'Datos actualizados';
    } else {
      return 'La asociacion no existe';
    }
  }

  async findByEmail(email:string):Promise<Asociaciones> {
    try {
      const asociacion = await this.asociacionesProviders.findOne({ where: { email } });
      return asociacion;
    } catch (error) {
      console.log(error);
    }
  }

  async findByToken(token:string | string[]):Promise<Asociaciones> {
    try {
      const asociacion = await this.asociacionesProviders.findOne({ where:{ reset:token } });
      return asociacion;
    } catch (error) {
      console.log(error);
    }
  }
}