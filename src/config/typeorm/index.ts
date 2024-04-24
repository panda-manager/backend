import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    //TODO: Not implemented
    /*
  const options = {
      ...config,
      type: 'mongodb',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepConnectionAlive: true,
      logging: true,
  };
*/
    return undefined;
  }
}
