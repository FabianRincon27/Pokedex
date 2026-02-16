import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PokemonModule } from '../pokemon/pokemon.module';
import { PokemonService } from '../pokemon/pokemon.service';

@Module({
  imports: [PokemonModule],
  providers: [CartService, PokemonService],
  controllers: [CartController],
})
export class CartModule { }
