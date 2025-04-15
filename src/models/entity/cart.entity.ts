import { Role, UserGender, UserVerifyStatus } from '~/constants/enums';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToOne,
    RelationId,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { ProductVariant } from './variant.entity';
import { Shop } from './shop.entity';

@Entity('carts')
export class Cart extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true, default: 0, type: 'double' })
    total: number;

    @Column({ nullable: true, default: 0, type: 'double' })
    total_before_discount: number;

    @OneToMany(() => CartItem, (cart_item) => cart_item.cart)
    cart_items: CartItem[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

@Entity('cart_items')
export class CartItem extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    block_id: number;

    @Column({ type: 'double', default: 0.0 })
    price: number;

    @Column({ type: 'double', default: 0.0 })
    price_before_discount: number;

    @Column({ type: 'double', default: 0.0 })
    total_price: number;

    @ManyToOne(() => Cart, (cart) => cart.cart_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.cart_items, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariant, (productvariant) => productvariant.cart_items)
    @JoinColumn({ name: 'product_variant_id' })
    productvariant: ProductVariant;

    @ManyToOne(() => Shop, (shop) => shop.cart_items, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'shop_id' })
    shop: Shop;

    @Column({ default: 1 })
    quantity: number;

    @Column({ default: false })
    selected_to_checkout: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @RelationId((cart_item: CartItem) => cart_item.product)
    product_id: number;

    @RelationId((cart_item: CartItem) => cart_item.productvariant)
    product_variant_id: number;

    @RelationId((cart_item: CartItem) => cart_item.shop)
    shop_id: number;
}
