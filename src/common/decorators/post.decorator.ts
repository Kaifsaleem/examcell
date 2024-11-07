import { applyDecorators, Post as NestPost } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

export default function CtmPost(path?: string | string[]) {
  return applyDecorators(
    NestPost(path),
    ApiBadRequestResponse({
      description: 'Bad Request',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'string', example: 'Bad Request' },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );
}
