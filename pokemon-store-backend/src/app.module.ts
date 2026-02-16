import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [UsersModule, AuthModule, PokemonModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
