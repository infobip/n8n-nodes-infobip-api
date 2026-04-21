import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class InfobipApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'InfobipApi',
		name: 'infobipApi',
		icon: { light: 'file:infobip.svg', dark: 'file:infobip.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Infobip API',
		defaults: {
			name: 'InfobipApi',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'infobipApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Check Delivery Report',
						value: 'checkDeliveryReport',
						action: 'Check delivery report',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						action: 'Send message',
					},
				],
				default: 'sendMessage',
				noDataExpression: true,
			},
			{
				displayName: 'Channel',
				name: 'channel',
				type: 'options',
				options: [
					{
						name: 'RCS',
						value: 'rcs',
					},
					{
						name: 'SMS',
						value: 'sms',
					},
					{
						name: 'Viber',
						value: 'viber',
					},
					{
						name: 'WhatsApp',
						value: 'whatsapp',
					},
				],
				default: 'sms',
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
					},
				},
				description: 'The messaging channel to use',
			},
			{
				displayName: 'Sender',
				name: 'sender',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
						channel: [
							'sms',
						],
					},
				},
				default: '',
				placeholder: 'Enter sender ID',
				description: 'The sender ID',
			},
			{
				displayName: 'Sender',
				name: 'sender',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
						channel: [
							'viber',
						],
					},
				},
				default: '',
				placeholder: 'Enter sender ID',
				description: 'The sender ID',
			},
			{
				displayName: 'Sender',
				name: 'sender',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
						channel: [
							'rcs',
							'whatsapp',
						],
					},
				},
				default: '',
				placeholder: 'Enter sender ID',
				description: 'The sender ID',
			},
			{
				displayName: 'To send a WhatsApp message, the user needs to have replied to the conversation in the last 24 hours. You can still start the conversation by sending a template message. <a href="https://www.infobip.com/docs/tutorials/send-whatsapp-template-messages" target="_blank">Learn more</a>',
				name: 'whatsappNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
						channel: [
							'whatsapp',
						],
					},
				},
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
					},
				},
				default: '',
				placeholder: 'Enter phone number',
				validateType: 'number',
				description: 'Destination phone number (Example: 41793026727)',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendMessage',
						],
					},
				},
				default: '',
				placeholder: 'Message',
				description: 'Content of the message',
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'checkDeliveryReport',
						],
					},
				},
				default: '',
				placeholder: 'Message ID',
				description: 'Unique identifier of the message whose delivery report you want to retrieve',
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		const returnData = [];
		const credentials = await this.getCredentials('infobipApi');
		const baseUrl = credentials?.domain as string;

		for (let i = 0; i < items.length; i++) {
			if (operation === 'sendMessage') {
				try {
					const responseData = await sendMessage.call(this, i, baseUrl);
					returnData.push(responseData);
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({ json: { error: error.message }, pairedItem: { item: i } })
						continue;
					}
					throw new NodeApiError(this.getNode(), error);
				}
			} else if (operation === 'checkDeliveryReport') {
				try {
					const responseData = await checkDeliveryReport.call(this, i, baseUrl);
					returnData.push(responseData);
				} catch (error) {
					if (this.continueOnFail()) {
						returnData.push({ json: { error: error.message }, pairedItem: { item: i } })
						continue;
					}
					throw new NodeApiError(this.getNode(), error);
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData.map((item, index) => ({
			json: item,
			pairedItem: { item: index }
		})))];
	}

}

async function sendMessage(
	this: IExecuteFunctions,
	iter: number,
	baseURL: string
): Promise<any> {
	const channel = this.getNodeParameter('channel', iter) as string;
	const phone = this.getNodeParameter('phone', iter) as string;
	const content = this.getNodeParameter('content', iter) as string;
	const sender = this.getNodeParameter('sender', iter) as string;

	let url: string;
	let body: IDataObject;

	switch (channel) {
		case 'sms':
			url = '/sms/3/messages';
			body = {
				messages: [
					{
						sender,
						destinations: [{ to: phone }],
						content: { text: content },
					},
				],
			};
			break;
		case 'rcs':
			url = '/rcs/2/messages';
			body = {
				messages: [
					{
						sender,
						destinations: [{ to: phone }],
						content: { text: content, type: 'TEXT' },
					},
				],
			};
			break;
		case 'viber':
			url = '/viber/2/messages';
			body = {
				messages: [
					{
						sender,
						destinations: [{ to: phone }],
						content: { type: 'TEXT', text: content },
					},
				],
			};
			break;
		case 'whatsapp':
			url = '/whatsapp/1/message/text';
			body = {
				from: sender,
				to: phone,
				content: { text: content },
			};
			break;
		default:
			throw new NodeApiError(this.getNode(), { message: `Unsupported channel: ${channel}` } as any);
	}

	const options: IHttpRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body,
		baseURL,
		url,
		json: true,
	};
	return await this.helpers.httpRequestWithAuthentication.call(this, 'infobipApi', options);
}

async function checkDeliveryReport(
	this: IExecuteFunctions,
	iter: number,
	baseURL: string
): Promise<any> {
	const messageId = this.getNodeParameter('messageId', iter) as string;

	const options: IHttpRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'GET',
		qs: {
			messageId: messageId,
		},
		baseURL,
		url: '/messages-api/1/reports',
		json: true,
	};
	return await this.helpers.httpRequestWithAuthentication.call(this, 'infobipApi', options);
}
