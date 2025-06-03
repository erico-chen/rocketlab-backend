import { Controller, Post, Get, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async createCart() {
    return this.cartService.createCart();
  }

  @Get(':id')
  async getCart(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.getCart(id);
  }

  @Post(':id/items')
  async addItemToCart(
    @Param('id', ParseIntPipe) cartId: number,
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.addItemToCart(cartId, productId, quantity);
  }

  @Delete(':cartId/items/:productId')
  async removeItemFromCart(
    @Param('cartId', ParseIntPipe) cartId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItemFromCart(cartId, productId);
  }

  @Post(':id/checkout')
  async checkout(@Param('id', ParseIntPipe) cartId: number) {
    return this.cartService.checkout(cartId);
  }
} 