import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { NODE_ENV } from './environments';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    if (NODE_ENV !== 'production') return;

    const cert_file_contents = fs.readFileSync('ssl/cert.pem').toString();
    const key_file_contents = fs.readFileSync('ssl/key.pem').toString();

    fs.writeFileSync(
      'ssl/cert.pem',
      cert_file_contents.replace(/\\n/g, '\n'),
      'utf8',
    );

    fs.writeFileSync(
      'ssl/key.pem',
      key_file_contents.replace(/\\n/g, '\n'),
      'utf8',
    );
  }
}
