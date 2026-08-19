import {EventBridgeClient, PutEventsCommand} from "@aws-sdk/client-eventbridge";
import {PutEventsCommandInput} from "@aws-sdk/client-eventbridge/dist-types/commands/PutEventsCommand";
import {PublishesMessages} from "./PublishesMessages";

export type EventBusArn = `arn:aws:events:${string}:${string}:event-bus/${string}`;

export const createPublishesMessagesViaAwsEventBridge: <MessagePayload extends { _named: string } = { _named: string }>(
    client: EventBridgeClient,
    eventBus: EventBusArn
) => PublishesMessages<MessagePayload> = (client, eventBus) => {
    return async (messages) => {
        const eventsToPublish: PutEventsCommandInput = {
            Entries: messages.map((message) => {
                return {
                    Detail: JSON.stringify(message),
                    DetailType: message.payload._named,
                    Source: 'ann',
                    EventBusName: eventBus
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
