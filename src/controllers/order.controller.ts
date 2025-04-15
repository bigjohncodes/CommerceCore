import { Request, Response } from 'express';
import HTTP_STATUS from '~/constants/httpStatus';
import { UpdateCheckout } from '~/models/dtos/order/checkout';
import { OrderService } from '~/services/order.service';
import { ApiError } from '~/utils/errors';

export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    async handleCheckout(req: Request, res: Response) {
        if (!req.decoded?._id) throw new ApiError('Lỗi người dùng', HTTP_STATUS.BAD_REQUEST);

        const user_id: string = req.decoded?._id;

        const result = await this.orderService.handleCheckout(user_id);

        res.json({
            success: true,
            message: null,
            result,
        });
    }

    async getCheckoutInfo(req: Request, res: Response) {
        if (!req.decoded?._id || !req.params?.session_checkout_id)
            throw new ApiError('Lỗi người dùng', HTTP_STATUS.BAD_REQUEST);

        const user_id: string = req.decoded?._id;
        const sessionID: string = req.params.session_checkout_id as string;

        const result = await this.orderService.getCheckoutInfo(user_id, sessionID);

        res.json({
            success: true,
            message: null,
            result,
        });
    }

    async updateCheckout(req: Request, res: Response) {
        if (!req.decoded?._id || !req.params?.session_checkout_id)
            throw new ApiError('Lỗi người dùng', HTTP_STATUS.BAD_REQUEST);

        const user_id: string = req.decoded?._id;
        const sessionID: string = req.params.session_checkout_id as string;
        const updateBody: UpdateCheckout = req.body;

        const result = await this.orderService.updateCheckout(user_id, sessionID, updateBody);

        res.json({
            success: true,
            message: null,
            result,
        });
    }

    async placeOrder(req: Request, res: Response) {
        if (!req.decoded?._id || !req.params?.session_checkout_id)
            throw new ApiError('Lỗi người dùng', HTTP_STATUS.BAD_REQUEST);

        const user_id: string = req.decoded?._id;
        const sessionID: string = req.params.session_checkout_id as string;

        const result = await this.orderService.placeOrder(user_id, sessionID);

        res.json({
            success: true,
            message: null,
            result,
        });
    }

    async getOrder(req: Request, res: Response) {
        // if (!req.decoded?._id || !req.params?.order_id)
        if (!req.params?.order_id) throw new ApiError('Lỗi người dùng', HTTP_STATUS.BAD_REQUEST);

        const order_id: string = req.params?.order_id;

        const result = await this.orderService.getOrder(order_id);

        res.json({
            success: true,
            message: null,
            result,
        });
    }

    async getUserOrders(req: Request, res: Response) {
        if (!req.decoded?._id) throw new ApiError('Lỗi người dùng', HTTP_STATUS.BAD_REQUEST);

        const user_id: string = req.decoded?._id;

        const result = await this.orderService.getUserOrders(user_id);

        res.json({
            success: true,
            message: null,
            result,
        });
    }
}
