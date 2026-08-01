import {EventBridgeClient, PutEventsCommand} from "@aws-sdk/client-eventbridge";
import {PutEventsCommandInput} from "@aws-sdk/client-eventbridge/dist-types/commands/PutEventsCommand";

export type MessageId = `message:${string}`;
export type ExternalId = `external:${string}`;
export type AnyMessageId = | MessageId | ExternalId

export type PublishStatus = {
    publishedMessages: MessageId[]
}

export type MessageMetadata = {
    ['Message-Id']: MessageId,
    ['Correlation-Id']: AnyMessageId,
    ['Causation-Id']: AnyMessageId
}

export type PublishesMessages<
    MessagePayload extends { _named: string } = { _named: string },
    Message extends { payload: MessagePayload, metadata: MessageMetadata } = {
        payload: MessagePayload,
        metadata: MessageMetadata
    },
> = (messages: Message[]) => Promise<PublishStatus>

export const createPublishesMessagesViaAwsEventBridge: <MessagePayload extends { _named: string } = { _named: string }>(
    client: EventBridgeClient
) => PublishesMessages<MessagePayload> = (client) => {
    return async (messages) => {
        const eventsToPublish: PutEventsCommandInput = {
            Entries: messages.map((message) => {
                return {
                    Detail: JSON.stringify(message),
                    DetailType: message.payload._named,
                    Source: 'ann'
                }
            }),
        };

        return client.send(new PutEventsCommand(eventsToPublish))
            .then((data) => {
                console.log(JSON.stringify(data, null, 2));

                return {
                    publishedMessages: messages.map((message) => message.metadata["Message-Id"])
                };
            })
            .catch((reason) => {
                // TODO: Model PublishStatus better to include potential errors
                console.log(reason);

                return {
                    publishedMessages: []
                };
            });
    }
}
