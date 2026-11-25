import 'reflect-metadata';
import {Controller,Get,Module,ServiceUnavailableException} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder,SwaggerModule} from '@nestjs/swagger';
import {TasksController} from './tasks.controller';
import {client,migrate} from './database';
import {CockpitController,migrateCockpit} from './cockpit';
@Controller('api') class HealthController {
 @Get(['health','v1/health']) async health(){try{await client.execute('SELECT 1');return {status:'ok',database:'sqlite',mode:'local-demo'};}catch{throw new ServiceUnavailableException('Database unavailable');}}
}
@Module({controllers:[HealthController,TasksController,CockpitController]}) export class AppModule {}
export async function main(){await migrate();await migrateCockpit();const app=await NestFactory.create(AppModule);const spec=new DocumentBuilder().setTitle('Tech Cockpit local clone').setVersion('0.1').build();SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,spec));await app.listen(Number(process.env.PORT||3000),'127.0.0.1');}
if (process.argv[1] && /(?:^|[\\/])(?:src|dist)[\\/]main\.(?:ts|js)$/.test(process.argv[1])) void main();
