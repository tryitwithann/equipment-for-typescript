import {describe, expect, test} from "vitest";
import {EventBridgeClient, PutEventsCommand} from "@aws-sdk/client-eventbridge";

import {requireEnvVar} from "../../EnvironmentVariables";
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

type TicketsWereSold = {
    _named: "Tickets were sold",
    ticketSaleId: `ticket-sale:${string}`,
    ticketSellerId: `ticket-seller:${string}`,
    ticketBuyerId: `ticket-buyer:${string}`,
    quantity: number,
    soldAt: number
};

const createPublishesMessagesViaAwsEventBridge: <MessagePayload extends { _named: string } = { _named: string }>(
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

describe("Publishes messages via AWS EventBridge", () => {
    const publishesMessagesViaAwsEventBridge = createPublishesMessagesViaAwsEventBridge<TicketsWereSold>(
        new EventBridgeClient({ region: requireEnvVar("AWS_REGION") })
    );

    test("Successfully publishes messages", async () => {
        const example: {
            payload: TicketsWereSold,
            metadata: MessageMetadata
        } = {
            payload: {
                _named: "Tickets were sold",
                ticketSaleId:     "ticket-sale:11111111-1111-1111-1111-111111111111",
                ticketSellerId: "ticket-seller:AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA",
                ticketBuyerId:   "ticket-buyer:BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB",
                quantity: 5,
                soldAt: 1785412927
            },
            metadata: {
                ['Message-Id']:     "message:99999999-9999-9999-9999-999999999999",
                ['Causation-Id']:   "message:88888888-8888-8888-8888-888888888888",
                ['Correlation-Id']: "message:77777777-7777-7777-7777-777777777777"
            }
        };

        const publishedMessages = await publishesMessagesViaAwsEventBridge([example]);

        expect(publishedMessages.publishedMessages.length).toBeGreaterThan(0);
        expect(publishedMessages.publishedMessages).toStrictEqual(["message:99999999-9999-9999-9999-999999999999"])
    });
});
