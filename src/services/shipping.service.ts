import { ProductDimensionDTO } from '~/models/dtos/product/CreateProductDTO';
import { ShippingInfoDTO } from '~/models/dtos/ShippingDTO';
import { Shipping } from '~/models/entity/shipping.entity';
import { ShippingRepository } from '~/repository/shipping.repository';

const UNIT_FEE: { [index: number]: number } = {
    [1]: 100000,
    [2]: 20000,
    [3]: 17000,
    [4]: 20000,
};

const DELIVERY_DAYS: { [index: number]: number[] } = {
    [1]: [1, 2],
    [2]: [4, 5],
    [3]: [7, 10],
    [4]: [5, 6],
};

const DIMENSION_FACTOR = 139;

export class ShippingService {
    constructor(protected readonly shippingRepository: ShippingRepository) {
        this.shippingRepository = new ShippingRepository();
    }

    async getAllShippingChannels() {
        const result = await this.shippingRepository.getAllChannels();

        return result;
    }

    async getProductShippingInfo(product_id: number) {
        return await this.shippingRepository.getShippingInfos(product_id);
    }

    async shippingInfoMerge(shipping_infos: ShippingInfoDTO[]) {
        let result: ShippingInfoDTO = {};

        let totalShipping = 0;

        for (const shipping_info of shipping_infos) {
            if (shipping_info.channel_id == 2) {
                totalShipping += shipping_info.fee ?? 0;
            }
        }

        return result = {
            ...shipping_infos[0],
            channel_id: 2,
            fee: totalShipping,
        };
    }
}

export class ShippingRatesManagementService extends ShippingService {
    constructor(protected readonly shippingRepository: ShippingRepository) {
        super(shippingRepository);
    }

    countingDIM(dimension: ProductDimensionDTO): number {
        if (!dimension.height || !dimension.width || !dimension.length) return 0;
        return (dimension.height * dimension.length * dimension.width) / DIMENSION_FACTOR;
    }

    async countingRates(payload: ProductDimensionDTO, shipping_channels: number[] | 'all') {
        const channels: Shipping[] = await this.shippingRepository.getAllChannels();

        const shippingDTOs: ShippingInfoDTO[] = [];

        for (const channel of channels) {
            if (!channel.shipping_channel_id) continue;

            if (shipping_channels !== 'all' && !shipping_channels.includes(channel.shipping_channel_id)) continue;
            const shippingDTO: ShippingInfoDTO = {};

            shippingDTO.channel_id = channel.shipping_channel_id;
            shippingDTO.name = channel.name;
            shippingDTO.fee =
                Math.round(
                    ((Number(payload.weight) + this.countingDIM(payload) * 0.1) * UNIT_FEE[shippingDTO.channel_id]) /
                    1000,
                ) * 1000;
            shippingDTO.estimated_delivery_days_min = DELIVERY_DAYS[shippingDTO.channel_id][0];
            shippingDTO.estimated_delivery_days_max = DELIVERY_DAYS[shippingDTO.channel_id][1];
            shippingDTOs.push(shippingDTO);
        }

        return shippingDTOs;
    }
}
