import { Controller, Get, Param, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) { }

  @Get()
  getAll(@Query('limit') limit?: string) {
    return this.pokemonService.getPokemonList(Number(limit) || 200);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.pokemonService.getPokemonById(Number(id));
  }
}
