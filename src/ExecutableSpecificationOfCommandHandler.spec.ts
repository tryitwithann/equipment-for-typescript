import {describe, expect, test} from "vitest";

type OfferTickets = {
    _named: "Offer tickets!",
    ticketSaleId: `ticket-sale:${string}`,
    ticketSellerId: `ticket-seller:${string}`,
    eventDetails: {
        show: string,
        scheduled: [string, string, string]
        location: {
            venue: string
            address: {
                street: string,
                streetNumber: string,
                streetNumberAddition: string,
                postalCode: string,
                city: string,
                country: string
            }
        }
    },
    availableTickets: number,
    priceInCents: [number, "EUR" | "GBP"]
}

type TicketsWereOffered = {
    _named: "Tickets were offered",
    ticketSaleId: `ticket-sale:${string}`,
    ticketSellerId: `ticket-seller:${string}`,
    eventDetails: {
        show: string,
        scheduled: [string, string, string]
        location: {
            venue: string
            address: {
                street: string,
                streetNumber: string,
                streetNumberAddition: string,
                postalCode: string,
                city: string,
                country: string
            }
        }
    },
    availableTickets: number,
    priceInCents: [number, "EUR" | "GBP"],
    offeredAt: [string, string]
}

type ExecuteScenario<AnyEvent, AnyCommand> = (givens: AnyEvent[], when: AnyCommand, thens: AnyEvent[]) => Promise<void>;

class ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    constructor(
        private preConditions: AnyEvent[],
        private trigger: AnyCommand,
        private outcomes: AnyEvent[]
    ) {
        // intentionally empty
    }

    async execute(executable: ExecuteScenario<AnyEvent, AnyCommand>) {
        const outcomes = this.outcomes;

        return executable(this.preConditions, this.trigger, outcomes);
    }
}

class WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    constructor(
        private preConditions: AnyEvent[],
        private trigger: AnyCommand
    ) {
        // intentionally empty
    }

    then(outcome: AnyEvent): ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        return new ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(this.preConditions, this.trigger, [outcome])
    }

    thenNothingShouldHaveHappened(): ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        return new ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(this.preConditions, this.trigger, [])
    }
}

class GivenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    constructor(
        private preConditions: AnyEvent[]
    ) {
        // intentionally empty
    }

    when(trigger: AnyCommand): WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        return new WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(this.preConditions, trigger)
    }
}

class ExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    given(preCondition: AnyEvent): GivenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        return new GivenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>([preCondition])
    }

    when(trigger: AnyCommand): WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        return new WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>([] as const, trigger)
    }
}

describe("Executable specification of command handler", () => {
    test("Simplest specification: When -> Then", async () => {
        type AnyTicketingEvent = | TicketsWereOffered;
        type AnyTicketingCommand = | OfferTickets;

        const trigger: OfferTickets = {
            _named: "Offer tickets!",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            ticketSellerId: "ticket-seller:9b079b1c-81b2-4acd-a1b6-75a10c08c595",
            eventDetails: {
                show: "Comedytrain",
                scheduled: ["2026-06-20 20:30", "2026-06-20 22:00", "Europe/Amsterdam"],
                location: {
                    venue: "Comedyclub Comedytrain",
                    address: {
                        street: "Pazzanistraat",
                        streetNumber: "1",
                        streetNumberAddition: "",
                        postalCode: "1014 DB",
                        city: "Amsterdam",
                        country: "NL"
                    }
                }
            },
            availableTickets: 150,
            priceInCents: [2250, "EUR"]
        };

        const outcome: TicketsWereOffered = {
            _named: "Tickets were offered",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            ticketSellerId: "ticket-seller:9b079b1c-81b2-4acd-a1b6-75a10c08c595",
            eventDetails: {
                show: "Comedytrain",
                scheduled: ["2026-06-20 20:30", "2026-06-20 22:00", "Europe/Amsterdam"],
                location: {
                    venue: "Comedyclub Comedytrain",
                    address: {
                        street: "Pazzanistraat",
                        streetNumber: "1",
                        streetNumberAddition: "",
                        postalCode: "1014 DB",
                        city: "Amsterdam",
                        country: "NL"
                    }
                }
            },
            availableTickets: 150,
            priceInCents: [2250, "EUR"],
            offeredAt: ["2026-05-04 09:07:15", "Europe/Amsterdam"]
        };

        return (new ExecutableSpecificationOfCommandHandler<AnyTicketingEvent, AnyTicketingCommand>())
            .when(trigger)
            .then(outcome)
            .execute(async (givens: AnyTicketingEvent[], when: AnyTicketingCommand, thens: AnyTicketingEvent[]) => {
                const expectedGivens = [] as const;
                const expectedWhen = trigger;
                const expectedThens = [outcome];
                
                expect(givens).toStrictEqual(expectedGivens);
                expect(when).toStrictEqual(expectedWhen);
                expect(thens).toStrictEqual(expectedThens);
            });
    })

    test("Common specification: Given(1) -> When -> Then(0)", async () => {
        type AnyTicketingEvent = | TicketsWereOffered;
        type AnyTicketingCommand = | OfferTickets;

        const preCondition: TicketsWereOffered = {
            _named: "Tickets were offered",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            ticketSellerId: "ticket-seller:9b079b1c-81b2-4acd-a1b6-75a10c08c595",
            eventDetails: {
                show: "Comedytrain",
                scheduled: ["2026-06-20 20:30", "2026-06-20 22:00", "Europe/Amsterdam"],
                location: {
                    venue: "Comedyclub Comedytrain",
                    address: {
                        street: "Pazzanistraat",
                        streetNumber: "1",
                        streetNumberAddition: "",
                        postalCode: "1014 DB",
                        city: "Amsterdam",
                        country: "NL"
                    }
                }
            },
            availableTickets: 150,
            priceInCents: [2250, "EUR"],
            offeredAt: ["2026-05-04 09:07:15", "Europe/Amsterdam"]
        };

        const trigger: OfferTickets = {
            _named: "Offer tickets!",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            ticketSellerId: "ticket-seller:9b079b1c-81b2-4acd-a1b6-75a10c08c595",
            eventDetails: {
                show: "Comedytrain",
                scheduled: ["2026-06-20 20:30", "2026-06-20 22:00", "Europe/Amsterdam"],
                location: {
                    venue: "Comedyclub Comedytrain",
                    address: {
                        street: "Pazzanistraat",
                        streetNumber: "1",
                        streetNumberAddition: "",
                        postalCode: "1014 DB",
                        city: "Amsterdam",
                        country: "NL"
                    }
                }
            },
            availableTickets: 150,
            priceInCents: [2250, "EUR"]
        };

        return (new ExecutableSpecificationOfCommandHandler<AnyTicketingEvent, AnyTicketingCommand>())
            .given(preCondition)
            .when(trigger)
            .thenNothingShouldHaveHappened()
            .execute(async (givens: AnyTicketingEvent[], when: AnyTicketingCommand, thens: AnyTicketingEvent[]) => {
                const expectedGivens = [preCondition];
                const expectedWhen = trigger;
                const expectedThens = [] as const;

                expect(givens).toStrictEqual(expectedGivens);
                expect(when).toStrictEqual(expectedWhen);
                expect(thens).toStrictEqual(expectedThens);
            });
    })
});
