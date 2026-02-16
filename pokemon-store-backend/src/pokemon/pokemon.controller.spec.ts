import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';

describe('PokemonController', () => {
    let controller: PokemonController;
    let pokemonService: jest.Mocked<PokemonService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PokemonController],
            providers: [
                {
                    provide: PokemonService,
                    useValue: {
                        getPokemonList: jest.fn(),
                        getPokemonById: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PokemonController>(PokemonController);
        pokemonService = module.get(PokemonService);
    });

    it('debe estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('debe llamar getPokemonList con el limit enviado', async () => {
            pokemonService.getPokemonList.mockResolvedValue([]);

            await controller.getAll('50');

            expect(pokemonService.getPokemonList).toHaveBeenCalledWith(50);
        });

        it('debe usar 200 si no se envía limit', async () => {
            pokemonService.getPokemonList.mockResolvedValue([]);

            await controller.getAll(undefined);

            expect(pokemonService.getPokemonList).toHaveBeenCalledWith(200);
        });

        it('debe usar 200 si limit no es un número válido', async () => {
            pokemonService.getPokemonList.mockResolvedValue([]);

            await controller.getAll('abc');

            expect(pokemonService.getPokemonList).toHaveBeenCalledWith(200);
        });
    });

    describe('getOne', () => {
        it('debe llamar getPokemonById con el id convertido a número', async () => {
            pokemonService.getPokemonById.mockResolvedValue({} as any);

            await controller.getOne('25');

            expect(pokemonService.getPokemonById).toHaveBeenCalledWith(25);
        });
    });
});
