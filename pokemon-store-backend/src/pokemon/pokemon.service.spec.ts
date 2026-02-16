import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PokemonService', () => {
    let service: PokemonService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PokemonService],
        }).compile();

        service = module.get<PokemonService>(PokemonService);

        // 🔥 LIMPIAR CACHES (CLAVE)
        (service as any).pokemonCache.clear();
        (service as any).listCache.clear();

        jest.clearAllMocks();
    });

    describe('getPokemonById', () => {
        it('debe obtener un pokemon y mapearlo correctamente', async () => {
            mockedAxios.get.mockImplementation((url: string) => {
                if (url.endsWith('/pokemon/1')) {
                    return Promise.resolve({
                        data: {
                            id: 1,
                            name: 'bulbasaur',
                            sprites: {
                                other: {
                                    'official-artwork': {
                                        front_default: 'image-url',
                                    },
                                },
                            },
                            types: [{ type: { name: 'grass' } }],
                        },
                    } as any);
                }

                if (url.includes('pokemon-species')) {
                    return Promise.resolve({
                        data: {
                            flavor_text_entries: [
                                {
                                    language: { name: 'en' },
                                    flavor_text: 'A strange seed was planted\non its back.',
                                },
                            ],
                        },
                    } as any);
                }

                throw new Error(`Unhandled URL: ${url}`);
            });

            const result = await service.getPokemonById(1);

            expect(result).toEqual({
                id: 1,
                name: 'bulbasaur',
                image: 'image-url',
                price: 24000,
                types: ['grass'],
                description: 'A strange seed was planted on its back.',
            });
        });

        it('debe usar cache si el pokemon ya fue solicitado', async () => {
            mockedAxios.get.mockImplementation((url: string) => {
                if (url.endsWith('/pokemon/1')) {
                    return Promise.resolve({
                        data: {
                            id: 1,
                            name: 'bulbasaur',
                            sprites: {
                                other: {
                                    'official-artwork': {
                                        front_default: 'img',
                                    },
                                },
                            },
                            types: [],
                        },
                    } as any);
                }

                if (url.includes('pokemon-species')) {
                    return Promise.resolve({
                        data: { flavor_text_entries: [] },
                    } as any);
                }

                throw new Error(`Unhandled URL: ${url}`);
            });

            await service.getPokemonById(1);
            await service.getPokemonById(1);

            expect(mockedAxios.get).toHaveBeenCalledTimes(2);
        });
    });

    describe('getPokemonList', () => {
        it('debe retornar una lista de pokemons', async () => {
            mockedAxios.get.mockImplementation((url: string) => {
                if (url.includes('?limit=2')) {
                    return Promise.resolve({
                        data: {
                            results: [
                                { url: 'https://pokeapi.co/api/v2/pokemon/1' },
                                { url: 'https://pokeapi.co/api/v2/pokemon/2' },
                            ],
                        },
                    } as any);
                }

                if (url.endsWith('/pokemon/1')) {
                    return Promise.resolve({
                        data: {
                            id: 1,
                            name: 'bulbasaur',
                            sprites: {
                                other: {
                                    'official-artwork': {
                                        front_default: 'img1',
                                    },
                                },
                            },
                            types: [],
                        },
                    } as any);
                }

                if (url.endsWith('/pokemon/2')) {
                    return Promise.resolve({
                        data: {
                            id: 2,
                            name: 'ivysaur',
                            sprites: {
                                other: {
                                    'official-artwork': {
                                        front_default: 'img2',
                                    },
                                },
                            },
                            types: [],
                        },
                    } as any);
                }

                if (url.includes('pokemon-species')) {
                    return Promise.resolve({
                        data: { flavor_text_entries: [] },
                    } as any);
                }

                throw new Error(`Unhandled URL: ${url}`);
            });

            const result = await service.getPokemonList(2);

            expect(result).toHaveLength(2);
            expect(result[0].image).toBe('img1');
            expect(result[1].image).toBe('img2');
        });

        it('debe usar cache para la lista', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { results: [] },
            } as any);

            await service.getPokemonList(10);
            await service.getPokemonList(10);

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPokemonDescription', () => {
        it('debe retornar texto por defecto si falla la API', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

            const description = await (service as any).getPokemonDescription(1);

            expect(description).toBe('No description available.');
        });
    });
});
