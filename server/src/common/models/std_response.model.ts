export class StdResponse<T> {
	data: T = null;
	requestId?: string = null;

	constructor(data: T, requestId?: string) {
		this.data = data;
		this.requestId = requestId;
	}
}
