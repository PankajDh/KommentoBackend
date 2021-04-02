import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class DefaultValidatorPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		const { metatype } = metadata;
		const object = !metatype ? value : plainToClass(metatype, value);
		const errors = await validate(object);
		if (errors.length) {
			throw new Error(errors[0].property);
		}
		return object;
	}
}
