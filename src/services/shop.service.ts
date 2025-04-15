import { plainToInstance } from 'class-transformer';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import { AddressDTO } from '~/models/dtos/AddressDTO';
import { RegisterInfoShopDTO, ShopDTO } from '~/models/dtos/ShopDTO';
import { UserDTO } from '~/models/dtos/UserDTO';
import { Shop } from '~/models/entity/shop.entity';
import { User } from '~/models/entity/user.entity';
import { AddressRepository } from '~/repository/address.repository';
import { ShopRepository } from '~/repository/shop.repository';
import { UserRepository } from '~/repository/user.repository';
import { ApiError } from '~/utils/errors';

export class ShopService {


    constructor(
        private shopRepository: ShopRepository,
        private addressRepository: AddressRepository,
        private userRepository: UserRepository,
    ) {
    }

    async register(payload: RegisterInfoShopDTO) {
        // Lấy user
        const user: User | null = await this.userRepository.findById(payload.user_id as string);

        if (!user) throw new ApiError(USERS_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);

        if (user?.is_shop) {
            throw new ApiError('Shop already registered!', HTTP_STATUS.BAD_REQUEST);
        }

        // Tạo shop
        const shopRegisterInfoDTO: RegisterInfoShopDTO = plainToInstance(RegisterInfoShopDTO, payload);
        const shop = await this.shopRepository.createShop(shopRegisterInfoDTO, user as User);

        // Tạo địa chỉ
        const addressDTO: AddressDTO = plainToInstance(AddressDTO, payload.pickup_address);
        const address = await this.addressRepository.createAddressForShop(addressDTO, shop);

        // Cập nhật shop address
        await this.shopRepository.updateShopAddress(shop.id, address.id);
        await this.userRepository.updateToShop(shop.user._id);

        const shopDTO: ShopDTO = plainToInstance(ShopDTO, shop);

        return await this.getInfo(user._id);
    }

    async getInfo(user_id: string) {
        const shop = await this.shopRepository.getShopByUserId(user_id);
        const shopDTO = plainToInstance(ShopDTO, shop);

        return shopDTO;
    }

    async getInfoById(shop_id: number) {
        const shop = await this.shopRepository.getShopByShopId(shop_id);

        if (!shop) {
            throw new ApiError('Shop is not exist!', HTTP_STATUS.BAD_REQUEST);
        }
        const shopDTO = plainToInstance(ShopDTO, shop);

        return shopDTO;
    }

    async deleteShop(user_id: string) {
        await this.shopRepository.deleteByUserId(user_id);
        await this.userRepository.updateRemoveShop(user_id);

        return;
    }
}
