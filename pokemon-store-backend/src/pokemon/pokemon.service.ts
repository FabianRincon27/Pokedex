import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokemonProduct } from './interfaces/pokemon.interface';

@Injectable()
export class PokemonService {
    private readonly pokemonUrl = 'https://pokeapi.co/api/v2/pokemon';
    private readonly speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species';

    private pokemonCache = new Map<number, PokemonProduct>();
    private listCache = new Map<number, PokemonProduct[]>();

    async getPokemonList(limit = 200): Promise<PokemonProduct[]> {
        if (this.listCache.has(limit)) {
            return this.listCache.get(limit)!;
        }

        const { data } = await axios.get(`${this.pokemonUrl}?limit=${limit}`);

        const pokemons = await Promise.all(
            data.results.map(async (pokemon: any) => {
                const details = await axios.get(pokemon.url);
                return this.mapToProduct(details.data);
            }),
        );

        this.listCache.set(limit, pokemons);
        return pokemons;
    }

    async getPokemonById(id: number): Promise<PokemonProduct> {
        if (this.pokemonCache.has(id)) {
            return this.pokemonCache.get(id)!;
        }

        const { data } = await axios.get(`${this.pokemonUrl}/${id}`);
        const product = await this.mapToProduct(data);

        this.pokemonCache.set(id, product);
        return product;
    }

    private async mapToProduct(data: any): Promise<PokemonProduct> {
        const description = await this.getPokemonDescription(data.id);

        return {
            id: data.id,
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default,
            price: this.calculatePriceCOP(data.id),
            types: data.types.map((t: any) => t.type.name),
            description,
        };
    }

    private async getPokemonDescription(id: number): Promise<string> {
        try {
            const { data } = await axios.get(`${this.speciesUrl}/${id}`);

            const entry = data.flavor_text_entries.find(
                (text: any) => text.language.name === 'en',
            );

            return entry
                ? entry.flavor_text.replace(/\n|\f/g, ' ')
                : 'No description available.';
        } catch {
            return 'No description available.';
        }
    }

    private calculatePriceCOP(id: number): number {
        const baseUSD = 5 + (id % 10);
        const usdToCop = 4000;
        return baseUSD * usdToCop;
    }
}
