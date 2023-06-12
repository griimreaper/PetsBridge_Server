import { Injectable, Inject, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';
import { FileService } from '../file/file.service';
import { Asociaciones } from '../asociaciones/entity/asociaciones.entity';
import { Users } from '../users/entity/users.entity';
import { asociacionesProviders } from 'src/asociaciones/providers/asociaciones.provider';
import { faker } from '@faker-js/faker';

export const AnimalSpecie = {
  DOG : 'perro',
  CAT : 'gato',
  ROEDOR : 'roedor',
  AVE : 'ave',
  OTRO : '',
};

@Injectable()
export class AnimalsService {
  constructor(
    @Inject('ANIMALS_REPOSITORY') 
    private readonly animalsRepository:typeof Animal,
    @Inject('ASOCIACIONES_REPOSITORY')
    private readonly asociationRepository: typeof Asociaciones,
    private readonly fileService: FileService,
  ) {}

  async getPets(): Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll();
      return animals;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async postPet(pet:AnimalDto, file: Express.Multer.File[]):Promise<string> {
    try {
      const urls:any = Array.isArray(file) ? await this.fileService.createFiles(file) : null;
      await this.animalsRepository.create({
        ...pet,
        status: 'homeless',
        image: urls,  
      });
      return 'La mascota se ha registrado!';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getAllPets():Promise<Animal[]> {
    try {
      const animals = await this.animalsRepository.findAll();
      return animals;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getPet(id:string):Promise<Animal> {
    try {
      const animal = await this.animalsRepository.findByPk(id,  {
        include: [
          { model: Asociaciones, as: 'asociacion', attributes: ['id', 'email', 'phone', 'nameOfFoundation', 'image'] },
        ],
      });
      if (!animal) {
        throw new HttpException('No existe esta mascota!', 404);
      }
      return animal;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async animalAssoc(id: string): Promise<Asociaciones> {
    const AsocAnimal = await this.asociationRepository.findByPk(id, {
      include: [Animal],
    });
    return AsocAnimal;
  }

  async deletePet(id:string):Promise<string> {
    try {
      const animal = await this.animalsRepository.findByPk(id);
      await animal.destroy();
      return 'Deleted succesfully';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async editAnimals(id:string, pet:AnimalDto, file: Express.Multer.File[]) {
    try {
      const urls: any = Array.isArray(file) ? await this.fileService.createFiles(file) : null;
      const animal = await this.animalsRepository.findByPk(id);
      if (!animal) {
        throw new HttpException('Este animal no existe', 404);
      }
      const updateAnimal = {
        name : pet.name,
        gender: pet.gender,
        city: pet.city,
        as_id: pet.as_id,
        userId: pet.userId,
        specie: pet.specie,
        status: 'homeless',
        description: pet.description,
        image: urls,
        country: pet.country,
        state: pet.state,
        age_M: pet.age_M,
        age_Y: pet.age_Y,
        weight: pet.weight,
      };
      await animal.update( { ...updateAnimal } );
      return 'Mascota actualizada con exito!';
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
    
  }

  async paginate(currentPage:number, slicePage: number):Promise<Array < { object: Animal } >> {
    try {
      const allAnimals = await this.animalsRepository.findAll();
      const extractAnimal = allAnimals.map((e) => e.dataValues);
      const allPages = { allPage: Math.ceil(extractAnimal.length / slicePage), currentPage };
      const next = currentPage * slicePage;
      const prev = next - slicePage;
      const animalPerPage = extractAnimal.slice(prev, next);
      if (animalPerPage.length) {
        return [...animalPerPage, allPages];
      }
      throw new NotFoundException('No hay más datos para mostrar');
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
    
  }

  async filtSpecie(filtro: string) {
   
    const filtAnimal = await this.animalsRepository.findAll({
      where:{
        specie: filtro,
      },
    });
    const dataAnimal = filtAnimal.map((e) => e.dataValues);
    return dataAnimal;
  }


  async generateAnimal() {
    try {
      const asociaciones = await this.asociationRepository.findAll({
        attributes: ['id'],
      });
      const asocID = asociaciones.map((e) => e.dataValues);
      const fakeAnimal = [];
      for (let i = 0; i < 20; i++) {
        const animals = {
          as_id: asocID[i].id,
          name: faker.company.name(),
          specie: faker.animal.type(),
          gender: faker.person.sexType(),
          status: 'homeless',
          description: faker.lorem.paragraph(),
          image: [faker.image.url()],
          country: faker.location.country(),
          state: faker.location.state(),
          city: faker.location.city(),
          age_y: faker.number.int({ max: 15 }).toString(),
          weight: faker.number.int({ max: 90 }).toString(),
        };
        fakeAnimal.push(animals);
      }
      await this.animalsRepository.bulkCreate(fakeAnimal);
      return fakeAnimal;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

}
