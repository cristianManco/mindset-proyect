import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Riwi Mindset API')
    .setDescription(
      'API para la salud mental y emocional de los coders de  riwi mindet .',
    )
    .setVersion('1.0')
    .addTag('Empoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(
    `La aplicación está en ejecución en: http://localhost:${port}/api`,
  );
}
bootstrap();
