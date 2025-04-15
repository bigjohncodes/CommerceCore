import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { property } from 'lodash';
import HTTP_STATUS from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import { ApiError } from '~/utils/errors';

interface ErrorValidation {
    property: string;
    value: any;
    constraints?: {
        [type: string]: string;
    };
    children: ErrorValidation[] | undefined;
}

const getError = async (errors: ValidationError[] | undefined) => {
    if (!errors) return undefined;
    const results = Promise.all(
        errors.map(async (error): Promise<ErrorValidation> => {
            return {
                property: error.property,
                value: error.value,
                constraints: error.constraints,
                children: await getError(error.children),
            };
        }),
    );

    return results;
};

export const validationMiddleware = (dtoClass: any, sent_in?: 'body' | 'params' | 'query') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sent_in_mapping = {
                body: req.body,
                params: req.params,
                query: req.query,
            };
            const dtoInstance = plainToInstance(dtoClass, sent_in_mapping[sent_in ?? 'body']);

            const errors = await validate(dtoInstance);

            if (errors.length > 0) {
                const errorMessages = await getError(errors);

                throw new ApiError(USERS_MESSAGES.VALIDATION_ERROR, HTTP_STATUS.UNPROCESSABLE_ENTITY, errorMessages);
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
