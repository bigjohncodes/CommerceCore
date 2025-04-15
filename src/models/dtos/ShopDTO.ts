import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { AddressDTO } from './AddressDTO';
import { UserDTO } from './UserDTO';
import { IsEmpty, IsNotEmpty, IsPhoneNumber, ValidateNested } from 'class-validator';
import { verify } from 'crypto';
import { AddressService } from '~/services/address.service';

@Exclude()
export class ShopDTO {
    @Expose({ name: 'id' })
    shopid?: string;

    @Expose({ name: 'user' })
    @Transform(({ value }) => plainToInstance(UserDTO, value))
    account?: UserDTO;

    @Expose()
    description?: string;

    @Expose()
    name?: string;

    @Expose()
    avatar?: string;

    @Expose({ name: 'verify' })
    status?: number; // 0: Chưa xác nhận mail, 1: Đã xác thực, 2: Khóa shop

    item_count?: number;
    cover_picture_url?: string;

    rating_star?: number; // số sao trung bình
    total_rating?: number; // tổng số lượt đánh giá
    response_rate?: number; // tỉ lệ phản hồi
    response_time?: number; // tốc độ phản hồi trung bình (tính bằng giây)
    follower_count?: number;
    last_time_active?: number; // timestamp

    @Expose()
    @Transform(({ value }) => value?.getTime())
    created_at?: number; // timestamp

    @Expose({ name: 'default_address_id' })
    default_address: AddressDTO | number;

    constructor(data: Partial<ShopDTO> = {}) {
        this.shopid = data.shopid;
        this.account = data.account;
        this.description = data.description;
        this.name = data.name;
        this.status = data.status ?? 0;
        this.rating_star = data.rating_star ?? 0;
        this.total_rating = data.total_rating ?? 0;
        this.item_count = data.item_count ?? 0;
        this.response_rate = data.response_rate ?? 0;
        this.response_time = data.response_time ?? 0;
        this.follower_count = data.follower_count ?? 0;
        this.cover_picture_url = data.cover_picture_url;
        this.last_time_active = data.last_time_active;
        this.created_at = data.created_at;
    }
}

export class RegisterInfoShopDTO {
    @IsEmpty()
    user_id?: string;

    @IsNotEmpty()
    name?: string;

    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone?: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    pickup_address?: AddressDTO;
}
