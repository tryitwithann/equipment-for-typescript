import {describe, expect, test} from "vitest";
import {EventBridgeClient} from "@aws-sdk/client-eventbridge";

import {requireEnvVar} from "../../EnvironmentVariables";
import {createPublishesMessagesViaAwsEventBridge, MessageMetadata} from "./PublishesMessagesViaAwsEventBridge";

type TicketsWereSold = {
    _named: "Tickets were sold",
    ticketSaleId: `ticket-sale:${string}`,
    ticketSellerId: `ticket-seller:${string}`,
    ticketBuyerId: `ticket-buyer:${string}`,
    quantity: number,
    soldAt: number
};

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
