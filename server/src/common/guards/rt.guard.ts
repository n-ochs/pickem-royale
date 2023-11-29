import { JWT_REFRESH } from '@common/constants';
import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenGuard extends AuthGuard(JWT_REFRESH) {
	constructor() {
		super();
	}
}
