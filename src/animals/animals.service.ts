import { Injectable, Inject, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { Animal } from './animals.entity';
import { AnimalDto } from './dto/animals.dto';
import { FileService } from 'src/file/file.service';
import { Asociaciones } from 'src/asociaciones/entity/asociaciones.entity';
import { Users } from 'src/users/entity/users.entity';
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
      const animals = await this.animalsRepository.findAll({
        attributes: ['id', 'name', 'as_id', 'image', 'userId', 'country', 'gender', 'state', 'city', 'status', 'description' ],
      });
      return animals;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async getPet(id:string):Promise<Animal> {
    try {
      const animal = await this.animalsRepository.findByPk(id,  {
        include: [
          { model: Asociaciones, as: 'asociacion', attributes: ['id', 'email', 'phone', 'nameOfFoundation', 'profilePic'] },
        ],
      });
      return animal;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  async animalAssoc(id: string) {
    console.log('detal animal');
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

  async filtSpecie(specie: string) {
    console.log(specie);
    const filtAnimal = await this.animalsRepository.findAll({
      where:{
        specie: specie,
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
      console.log(fakeAnimal);
      await this.animalsRepository.bulkCreate(fakeAnimal);
      return fakeAnimal;
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

}
