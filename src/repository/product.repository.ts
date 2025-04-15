import {
    Between,
    FindOneOptions,
    FindOptionsOrder,
    LegacyOracleNamingStrategy,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';
import AppDataSource from '~/dbs/db';
import { Filter } from '~/models/dtos/FilterDTO';
import { Pagination } from '~/models/dtos/PaginationDTO';
import { CreateProductDTO } from '~/models/dtos/product/CreateProductDTO';
import { PriceDTO } from '~/models/dtos/product/ProductDTO';
import { AttributeValue } from '~/models/entity/attribute.entity';
import { Brand } from '~/models/entity/brand.entity';
import { CartItem } from '~/models/entity/cart.entity';
import { Image } from '~/models/entity/image.entity';
import { Product } from '~/models/entity/product.entity';
import { Shipping } from '~/models/entity/shipping.entity';
import { Shop } from '~/models/entity/shop.entity';
import { Option, ProductVariant } from '~/models/entity/variant.entity';

export class ProductRepository extends Repository<Product> {
    constructor() {
        super(Product, AppDataSource.manager);
        // this.repo = AppDataSource.getRepository(Product);
    }

    async findProductById(id: number) {
        const product: Product | null = await this.createQueryBuilder('product')
            .leftJoin('product.shop', 'shop')
            .addSelect(['shop.id', 'shop.name', 'shop.avatar'])

            .leftJoin('product.shipping_channels', 'shipping_channels')
            .leftJoin('shipping_channels.shipping', 'shipping')

            .leftJoin('product.images', 'images')
            .addSelect(['images.image_url'])

            .leftJoin('product.options', 'options')
            .addSelect(['options.name'])

            .leftJoin('options.values', 'values')
            .addSelect(['values.value_name'])

            .leftJoin('product.attributes', 'attributes')
            .addSelect(['attributes.attribute', 'attributes.value'])
            .where('product._id = :_id', { _id: id })
            .getOne();

        return product;
    }

    async findAll({
        pagination,
        filter,
        cate_id,
        keyword,
    }: {
        pagination?: Pagination;
        filter?: Filter;
        cate_id?: number;
        keyword?: string;
    }) {
        return (
            (await this.find({
                skip: pagination?.limit ? pagination?.limit * ((pagination?.page ?? 1) - 1) : 0,
                take: pagination?.limit,
                order: {
                    price: filter?.by === 'price' ? filter?.order : undefined,
                    created_at: filter?.by === 'ctime' ? 'asc' : undefined,
                },
                where: {
                    price: filter?.price_max
                        ? Between(filter?.price_min as number, filter?.price_max as number)
                        : MoreThanOrEqual(filter?.price_min as number),
                    category_id: cate_id ?? undefined,
                    title: keyword ? Like(`% ${keyword} %`) : undefined,
                },
                relations: ['images'],
            })) ?? []
        );
    }

    async countAll({ cate_id, keyword }: { cate_id?: number; keyword?: string }) {
        return await this.count({
            cache: true,
            where: {
                category_id: cate_id ?? undefined,
                title: keyword ? Like(`% ${keyword} %`) : undefined,
            },
        });
    }

    async createProduct(
        data: Partial<CreateProductDTO>,
        price_detail: PriceDTO,
        shop_id?: number,
        // brand: Brand,
        // images: Image[],
        // options: Option[],
        // attributes: AttributeValue[],
        // shop: Shop,
        // shipping_channels: Shipping[]
    ) {
        const product = await this.create({
            title: data.title ?? '',
            sku: data.sku ?? '',
            description: data.description ?? '',
            image: data?.image_urls?.[0] ? data.image_urls[0] : undefined,
            category_id: data.cate_id ?? 0,
            quantity: data.stock ?? 0,
            price: price_detail.price ?? 0,
            old_price: price_detail.price_before_discount ?? 0,
            price_range_min: price_detail.range_min ?? 0,
            price_range_max: price_detail.range_max ?? 0,
            price_range_min_old: price_detail.range_min_before_discount ?? 0,
            price_range_max_old: price_detail.range_max_before_discount ?? 0,
            discount: price_detail.discount ?? 0,
            buyturn: 0,
            weight: data.dimension?.weight ? data.dimension?.weight * 1000 : 0,
            width: data.dimension?.width ?? 0,
            height: data.dimension?.height ?? 0,
            length: data.dimension?.length ?? 0,
            shop: {
                id: shop_id ?? 0,
            },
            // brand,
            // images,
            // options,
            // attributes,
            // shop,
            // shipping_channels,
        }).save();

        return product;
    }

    async updateRelations(
        data: {
            brand?: Brand;
            shop?: Shop;
            shipping_channels?: Shipping[];
        },
        product: Product,
    ) {
        return await this.merge(product, {
            ...data,
        }).save();
    }

    async addCategoriesProduct(categories: number[], product_id: number) {
        await this.createQueryBuilder().relation(Product, 'categories').of(product_id).add(categories);
    }

    async getShippingInfo(id: number) {
        return await this.find;
    }
}
