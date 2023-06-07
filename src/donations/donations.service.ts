import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Donations } from './entity/donations.entity';
import { CreateDonationsDto } from './dto/donations.dto';

@Injectable()
export class DonationsService {
  constructor(
    @Inject('DONATIONS_REPOSITORY')
    private donationsService: typeof Donations,
  ) {}

  async findAll(): Promise<Donations[]> {
    const donations = await this.donationsService.findAll();
    return donations;
  }

  async createUser(createUserDto: CreateDonationsDto) {
    try {
      const newUser = await this.donationsService.create({
        ...createUserDto,
      });
      return newUser;
    } catch (error) {
      throw new HttpException('Error al intentar crear una donacion', 404);
    }
  }

  async update(id: string, { mount, message }): Promise<string> {
    try {
      if (!message && !mount) {
        return 'Nada que actualizar';
      }
      const publicacion = await this.donationsService.findByPk(parseInt(id));
      if (publicacion) {
        if (mount) {
          publicacion.mount = mount;
        }
        if (message) {
          publicacion.message = message;
        }
        await publicacion.save();
        return 'Actualizado';
      } else {
        throw new Error('No existe la donación');
      }
    } catch (error) {
      throw new HttpException('Error al actualizar las donaciones', 404);
    }
  }

  async delete(id: string): Promise<string> {
    try {
      const user = await this.donationsService.findByPk(parseInt(id));

      if (!user) {
        throw new Error(`La donacion con el ID '${id}' no se encuentra`);
      }
      await this.donationsService.destroy({ where: { id: parseInt(id) } });
      return 'Eliminado';
    } catch (error) {
      throw new HttpException('Error al intentar remover las donaciones', 404);
    }
  }
}
