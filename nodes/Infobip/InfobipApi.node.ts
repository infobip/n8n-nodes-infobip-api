import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IRequestOptions,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class InfobipApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'InfobipApi',
		name: 'infobipApi',
		icon: { light: 'file:infobip.svg', dark: 'file:infobip.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Infobip SMS API',
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
						name: 'Send an SMS',
						value: 'sendSms',
						action: 'Send an SMS',
					},
					{
						name: 'View SMS Delivery Report',
						value: 'smsDeliveryReport',
						action: 'View sms delivery report',
					},
				],
				default: 'sendSms',
				noDataExpression: true,
			},
            {
				displayName: 'Sender',
				name: 'sender',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendSms',
						],
					},
				},
				default: '',
				placeholder: 'Enter sender ID',
				description: 'The sender ID',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'sendSms',
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
							'sendSms',
						],
					},
				},
				default:'',
				placeholder: 'Message',
				description:'Content of the message',
			},
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'smsDeliveryReport',
						],
					},
				},
				default: '',
				placeholder: 'Message ID',
				description: 'Unique identifier of the SMS message whose delivery report you want to retrieve',
			},
		],
	};
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Handle data coming from previous nodes
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		const returnData = [];
		const credentials = await this.getCredentials('infobipApi');
		const baseUrl = credentials?.domain as string;

		for (let i = 0; i < items.length; i++) {
			if (operation === 'sendSms') {
				const responseData = await sendSms.call(this, i, baseUrl);
				returnData.push(responseData);
			}
			if (operation === 'smsDeliveryReport') {
				const responseData = await smsDeliveryReport.call(this, i, baseUrl);
				returnData.push(responseData);
			}
		}
	
		return [this.helpers.returnJsonArray(returnData)];
	}

}

async function sendSms(
	this: IExecuteFunctions, 
	iter: number, 
	baseUrl: string
): Promise<any> {
	const phone = this.getNodeParameter('phone', iter) as string;
	const content = this.getNodeParameter('content', iter) as string;
	const sender = this.getNodeParameter('sender', iter) as string;
	const data: IDataObject = {
		sender,
		destinations: [
			{ to: phone }
		],
		content: {
			text: content
		}
	};

	const options: IRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: {
			messages: [
				data,
			],
		},
		uri: `${baseUrl}/sms/3/messages`,
		json: true,
	};
	return await this.helpers.requestWithAuthentication.call(this, 'infobipApi', options);
}

async function smsDeliveryReport(
	this: IExecuteFunctions, 
	iter: number, 
	baseUrl: string
): Promise<any> {
	const messageId = this.getNodeParameter('messageId', iter) as string;

	const options: IRequestOptions = {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'GET',
		qs: {
			messageId: messageId,
		},
		uri: `${baseUrl}/sms/3/reports`,
		json: true,
	};
	return await this.helpers.requestWithAuthentication.call(this, 'infobipApi', options);
}
