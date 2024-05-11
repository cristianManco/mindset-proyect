// Código para el archivo de configuración de la base de datos en la aplicación de la cadena de hoteles
import { registerAs } from '@nestjs/config';

export default registerAs('dbConfig', () => {
  const dbConfig = {
    db: {
      connection: process.env.DB_CONNECTION,
      host: process.env.DB_HOST,
      name: process.env.DB_NAMELOCAL,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      atlas: process.env.DB_NAME,
    },
    env: process.env.NODE_ENV || 'local',
  };
  return dbConfig;
});
