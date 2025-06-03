import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem, Product } from '.prisma/client';

type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product;
  })[];
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async createCart(): Promise<CartWithItems> {
    return this.prisma.cart.create({
      data: {},
      include: { items: { include: { product: true } } },
    }) as Promise<CartWithItems>;
  }

  async getCart(id: number): Promise<CartWithItems> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart as CartWithItems;
  }

  async addItemToCart(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem & { product: Product }> {
    // Check if cart exists
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find((item: CartItem) => item.productId === productId);

    if (existingItem) {
      // Update quantity if item exists
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true },
      }) as Promise<CartItem & { product: Product }>;
    }

    // Create new cart item if it doesn't exist
    return this.prisma.cartItem.create({
      data: {
        quantity,
        cart: { connect: { id: cartId } },
        product: { connect: { id: productId } },
      },
      include: { product: true },
    }) as Promise<CartItem & { product: Product }>;
  }

  async removeItemFromCart(cartId: number, productId: number): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
      },
    });

    if (!cartItem) {
      throw new NotFoundException(`Item not found in cart`);
    }

    return this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });
  }

  async checkout(cartId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    }) as CartWithItems;

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (cart.items.length === 0) {
      throw new Error('Cannot checkout empty cart');
    }

    // Calculate total
    const total = cart.items.reduce(
      (sum: number, item: CartItem & { product: Product }) =>
        sum + item.product.price * item.quantity,
      0,
    );

    // Create order and order items
    const order = await this.prisma.order.create({
      data: {
        total,
        items: {
          create: cart.items.map((item: CartItem & { product: Product }) => ({
            quantity: item.quantity,
            price: item.product.price,
            product: { connect: { id: item.productId } },
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Mark cart as checked out
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { status: 'checked_out' },
    });

    return order;
  }
} 