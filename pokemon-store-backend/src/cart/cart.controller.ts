import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  getCart(@CurrentUser() user: AuthUser) {
    return this.cartService.getCart(user.userId);
  }

  @Post()
  addToCart(
    @CurrentUser() user: AuthUser,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(
      user.userId,
      dto.pokemonId,
      dto.quantity,
    );
  }

  @Delete(':pokemonId')
  removeFromCart(
    @CurrentUser() user: AuthUser,
    @Param('pokemonId') pokemonId: string,
  ) {
    return this.cartService.removeFromCart(
      user.userId,
      Number(pokemonId),
    );
  }

  @Get('summary')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.cartService.getCartSummary(user.userId);
  }

}
