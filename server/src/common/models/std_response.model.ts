export class StdResponse<T> {
	data: T = null;
	message: string = null;
	statusCode: number = null;
	requestId?: string = null;

	constructor(data: T, message: string, statusCode: number, requestId?: string) {
		this.data = data;
		this.message = message;
		this.statusCode = statusCode;
		this.requestId = requestId;
	}
}
