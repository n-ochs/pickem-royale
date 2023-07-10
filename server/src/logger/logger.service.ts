import { ClsService } from 'nestjs-cls';

import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
	constructor(private readonly clsService: ClsService) {
		super();
	}

	log(message: any, stack?: string, context?: string): void {
		if (stack && !context) {
			super.log(message, stack);
			return;
		}
		if (!stack && context) {
			super.log(message, context);
			return;
		}
		if (stack && context) {
			super.log(message, stack, context);
			return;
		}
		super.log(message);
		return;
	}

	error(message: any, stack?: string, context?: string): void {
		if (stack && !context) {
			super.error(message, stack);
			return;
		}
		if (!stack && context) {
			super.error(message, context);
			return;
		}
		if (stack && context) {
			super.error(message, stack, context);
			return;
		}
		super.error(message);
		return;
	}

	warn(message: any, stack?: string, context?: string): void {
		if (stack && !context) {
			super.warn(message, stack);
			return;
		}
		if (!stack && context) {
			super.warn(message, context);
			return;
		}
		if (stack && context) {
			super.warn(message, stack, context);
			return;
		}
		super.warn(message);
		return;
	}

	debug(message: any, stack?: string, context?: string): void {
		if (stack && !context) {
			super.debug(message, stack);
			return;
		}
		if (!stack && context) {
			super.debug(message, context);
			return;
		}
		if (stack && context) {
			super.debug(message, stack, context);
			return;
		}
		super.debug(message);
		return;
	}

	verbose(message: any, stack?: string, context?: string): void {
		const requestId: string = this.clsService.getId();
		let newMessage: string = message;

		if (requestId) {
			newMessage = [`[${requestId}]`, message].join(' - ');
		}

		if (stack && !context) {
			super.verbose(newMessage, stack);
			return;
		}
		if (!stack && context) {
			super.verbose(newMessage, context);
			return;
		}
		if (stack && context) {
			super.verbose(newMessage, stack, context);
			return;
		}
		super.verbose(newMessage);
		return;
	}
}
