import { IS_PUBLIC } from '@common/constants';
import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const Public: () => CustomDecorator<string> = () => SetMetadata(IS_PUBLIC, true);
