import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!isNaN(value)) {
      return Number(value);
    }
    return value;
  }
}
