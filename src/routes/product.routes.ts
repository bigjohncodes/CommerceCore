import { makeInvoker } from 'awilix-express';
import { Router } from 'express';
import { Role } from '~/constants/enums';
import container from '~/container';
import { ProductController } from '~/controllers/product.controller';
import { accessTokenValidator, authorizeRole, isShop, platformValidator } from '~/middlewares/auth.middleware';
import { validationMiddleware } from '~/middlewares/validation.middleware';
import { Pagination } from '~/models/dtos/PaginationDTO';
import { CreateProductDTO } from '~/models/dtos/product/CreateProductDTO';
import { GetProductDTO } from '~/models/dtos/product/GetProductDTO';
import { CategoryId, Keyword } from '~/models/dtos/SearchValidDTO';
import { asyncHandler } from '~/utils/asyncHandler';

const router = Router();
const api = makeInvoker<ProductController>(() => container.resolve('productController'));

router
    .route('/upload-product-images')
    /**
     * Description. Upload product images
     * Path: /upload-product-images
     * Method: POST
     * Content-type: multipart/form-data
     * Headers: { Authorization: string, User-Agent: string }
     */
    .post(platformValidator, accessTokenValidator, isShop(), asyncHandler(api('uploadProductImages')));

router
    .route('/create-new-product')
    /**
     * Description. Create product infos
     * Path: /create-new-product
     * Method: POST
     * Headers: { Authorization: string, User-Agent: string }
     * Body: UploadProductDTO
     */
    .post(
        platformValidator,
        accessTokenValidator,
        validationMiddleware(CreateProductDTO),
        isShop(),
        asyncHandler(api('createProductInfos')),
    );

router
    .route('/search-by-cate')
    /**
     * Description. Search product by cate
     * Path: /search-by-cate
     * Method: GET
     * Headers: { Authorization: string, User-Agent: string }
     */
    .get(
        validationMiddleware(Pagination, 'query'),
        validationMiddleware(CategoryId, 'query'),
        asyncHandler(api('getAllProducts')),
    );

router
    .route('/search-by-keyword')
    /**
     * Description. Search product by keyword
     * Path: /search-by-keyword
     * Method: GET
     * Query: { keyword: string }
     */
    .get(
        validationMiddleware(Pagination, 'query'),
        validationMiddleware(Keyword, 'query'),
        asyncHandler(api('getAllProducts')),
    );

router
    .route('/all')
    /**
     * Description. Get all products
     * Path: /all'
     * Method: GET
     */
    .get(validationMiddleware(Pagination, 'query'), asyncHandler(api('getAllProducts')));

router
    .route('/:id')
    /**
     * Description. Get produc by id
     * Path: /:id'
     * Method: GET
     */
    .get(validationMiddleware(GetProductDTO, 'params'), asyncHandler(api('getProductById')))
    .delete(platformValidator, accessTokenValidator, isShop(), asyncHandler(api('deleteProduct')));

export default router;
