import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MainModule } from './main.module';
import * as bluebird from 'bluebird';
import { DefaultValidatorPipe } from './common/pipes/default-validator.pipe';
import * as compression from 'compression';

function setUpPromise() {
	global.Promise = bluebird;
}

function setupPipes(app: NestExpressApplication) {
	app.useGlobalPipes(new DefaultValidatorPipe());
}

function setupHeaders(app: NestExpressApplication) {
	app.use(compression());
}

function setupCors(app: NestExpressApplication) {
	app.enableCors({
		allowedHeaders: [
			'access-token',
			'Accept',
			'application-type',
			'Authorization',
			'Content-Disposition',
			'Content-Type',
			'Origin',
			'X-Requested-With',
			'user-id',
			'organisation-id',
			'username',
			'organisation-pretty-name',
			'X-LogRocket-URL',
			'x-api-key',
			'x-forwarded-for',
			'x-real-ip',
		],
		exposedHeaders: ['Content-Disposition'],
		origin: '*',
		methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH', 'PUT'],
	});
}
function setup(app: NestExpressApplication) {
	setupCors(app);
	setupPipes(app);
	setupHeaders(app);
}

async function bootstrap() {
	try {
		const app = await NestFactory.create<NestExpressApplication>(
			MainModule,
			{
				logger: console,
				abortOnError: false,
			},
		);
		setup(app);
		await app.listen(3331);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}
setUpPromise();
bootstrap();
