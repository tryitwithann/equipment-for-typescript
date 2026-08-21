export type MessageId = `message:${string}`;
export type ExternalId = `external:${string}`;
export type AnyMessageId = | MessageId | ExternalId

export type PublishStatus = {
    publishedMessages: MessageId[]
}

export type MessageMetadata = {
    ['Message-Id']: AnyMessageId,
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
