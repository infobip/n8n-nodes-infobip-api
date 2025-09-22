# n8n-nodes-infobip-api

**⚠️ Beta Version**: This node is currently in beta. Features and APIs may change.

This is an n8n community node. It lets you use Infobip SMS API in your n8n workflows.

Infobip is a global cloud communications platform that enables businesses to send SMS messages, make voice calls, and engage with customers through various messaging channels.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

You can install this node using:

```bash
npm install @infobip/n8n-nodes-infobip-api
```

## Operations

* **Send SMS**: Send SMS messages to recipients via the Infobip SMS API
* **View SMS Delivery Report**: Retrieve delivery reports for previously sent SMS messages

## Credentials

To use this node, you need an Infobip account and API credentials:

1. Sign up for an [Infobip account](https://www.infobip.com/)
2. Obtain your API key from the Infobip Developer Hub
3. In n8n, create new Infobip API credentials with:
   - **API Key**: Your Infobip API key
   - **Domain**: Your Infobip API domain (defaults to `https://api.infobip.com/`)

## Compatibility

This node requires:
- n8n version 1.0 or later
- Node.js version 20 or higher

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Infobip SMS API documentation](https://www.infobip.com/docs/api/channels/sms)
* [Infobip API authentication](https://www.infobip.com/docs/api#authentication)
