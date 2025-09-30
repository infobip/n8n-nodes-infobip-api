import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties
} from 'n8n-workflow';

export class InfobipApi implements ICredentialType {
	name = 'infobipApi';
	displayName = 'Infobip API';
	documentationUrl = 'https://www.infobip.com/docs/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		},
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: 'https://api.infobip.com/',
			placeholder: 'https://api.infobip.com/',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"App " + $credentials.apiKey}}',
			},
		},
	};
}
