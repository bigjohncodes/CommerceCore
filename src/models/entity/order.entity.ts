import { DeliveryStatus, OrderStatus, Role, ShopVerifyStatus, UserGender, UserVerifyStatus } from '~/constants/enums';
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
} from 'typeorm';
import { Address } from './address.entity';
import { Cart, CartItem } from './cart.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ShippingDetail } from './shipping.entity';
import { ProductVariant } from './variant.entity';
import { Shop } from './shop.entity';
import { PaymentDetail } from './payment.entity';

@Entity('orders')
export class Order extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.orders, { cascade: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToOne(() => PaymentDetail, (payment_detail) => payment_detail.order, { cascade: true })
    @JoinColumn({ name: 'payment_id' })
    payment: PaymentDetail;

    @Column({ default: 0 })
    total: number;

    @Column({ default: 0 })
    total_product: number;

    @OneToOne(() => ShippingDetail, (shipping_detail) => shipping_detail.order, { cascade: true })
    @JoinColumn({ name: 'shipping_detail_id' })
    shipping: ShippingDetail;

    @OneToMany(() => DeliveryTracking, (d) => d.order)
    delivery_tracking: DeliveryTracking[];

    @Column({ nullable: true, type: 'text' })
    desc: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => OrderItem, (orderitem) => orderitem.order, { cascade: true })
    order_items: OrderItem[];

    @ManyToOne(() => Shop, (s) => s.orders, { cascade: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'shop_id' })
    shop: Shop;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Ordered })
    status: OrderStatus;
}

@Entity('order_items')
export class OrderItem extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Order, (order) => order.order_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, (product) => product.order_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariant, (productvariant) => productvariant.order_items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_variant_id' })
    productvariant: ProductVariant;

    @Column({ type: 'double', default: 0.0 })
    price: number;

    @Column({ type: 'double', default: 0.0 })
    totalprice: number;

    @Column({ default: 1 })
    quantity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

@Entity('delivery_tracking')
export class DeliveryTracking {
    @PrimaryGeneratedColumn('increment', { type: 'int' })
    id: number;

    @Column({ type: 'enum', enum: DeliveryStatus })
    status: DeliveryStatus;

    @ManyToOne(() => Order, (o) => o.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'date' })
    timestamp: Date;

    @Column({ type: 'text' })
    message: string;
}
