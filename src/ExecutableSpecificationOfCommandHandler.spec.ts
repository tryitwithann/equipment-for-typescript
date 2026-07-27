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

type ReserveTickets = {
    _named: "Reserve tickets!",
    ticketSaleId: `ticket-sale:${string}`,
    basket: `basket:${string}`,
    desiredNumberOfTickets: number
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

type TicketsWereReserved = {
    _named: "Tickets were reserved",
    ticketSaleId: `ticket-sale:${string}`,
    basket: `basket:${string}`,
    desiredNumberOfTickets: number,
    reservedNumberOfTickets: number
}

type LastTicketsWereReserved = {
    _named: "Last tickets were reserved",
    ticketSaleId: `ticket-sale:${string}`,
    totalNumberOfReservedTickets: number,
}

type AnyTicketingEvent = | TicketsWereOffered | TicketsWereReserved | LastTicketsWereReserved;
type AnyTicketingCommand = | OfferTickets | ReserveTickets;

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
        return executable(this.preConditions, this.trigger, this.outcomes);
    }
}

class WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    constructor(
        private preConditions: AnyEvent[],
        private trigger: AnyCommand
    ) {
        // intentionally empty
    }

    then(
        firstOutcome: AnyEvent,
        ...additionalOutcomes: AnyEvent[]
    ): ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        const outcomes = [
            firstOutcome,
            ...additionalOutcomes
        ];

        return new ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(
            this.preConditions,
            this.trigger,
            outcomes
        );
    }

    thenNothingShouldHaveHappened(): ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        const noOutcomesExpected: AnyEvent[] = [] as const;

        return new ThenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(
            this.preConditions,
            this.trigger,
            noOutcomesExpected
        );
    }
}

class GivenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    constructor(
        private preConditions: AnyEvent[]
    ) {
        // intentionally empty
    }

    when(trigger: AnyCommand): WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        return new WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(this.preConditions, trigger);
    }
}

class ExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
    given(
        firstPreCondition: AnyEvent,
        ...additionalPreConditions: AnyEvent[]
    ): GivenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        const preConditions = [
            firstPreCondition,
            ...additionalPreConditions
        ];

        return new GivenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(preConditions);
    }

    when(trigger: AnyCommand): WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
        const noPreConditionsExpected: AnyEvent[] = [] as const;

        return new WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand>(
            noPreConditionsExpected,
            trigger
        );
    }
}

describe("Executable specification of command handler", () => {
    test("Simplest specification: When -> Then", async () => {
        const offerTickets: OfferTickets = {
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

        const ticketsWereOffered: TicketsWereOffered = {
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
            .when(offerTickets)
            .then(ticketsWereOffered)
            .execute(async (preConditions: AnyTicketingEvent[], trigger: AnyTicketingCommand, outcomes: AnyTicketingEvent[]) => {
                const expectedPreConditions = [] as const;
                const expectedTrigger = offerTickets;
                const expectedOutcomes = [ticketsWereOffered];
                
                expect(preConditions).toStrictEqual(expectedPreConditions);
                expect(trigger).toStrictEqual(expectedTrigger);
                expect(outcomes).toStrictEqual(expectedOutcomes);
            });
    })

    test("Common specification: Given(1) -> When -> Then(0)", async () => {
        const ticketsWereOffered: TicketsWereOffered = {
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

        const offerTickets: OfferTickets = {
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
            .given(ticketsWereOffered)
            .when(offerTickets)
            .thenNothingShouldHaveHappened()
            .execute(async (preConditions: AnyTicketingEvent[], trigger: AnyTicketingCommand, outcomes: AnyTicketingEvent[]) => {
                const expectedPreConditions = [ticketsWereOffered];
                const expectedTrigger = offerTickets;
                const expectedOutcomes = [] as const;

                expect(preConditions).toStrictEqual(expectedPreConditions);
                expect(trigger).toStrictEqual(expectedTrigger);
                expect(outcomes).toStrictEqual(expectedOutcomes);
            });
    });

    test("Common specification: Given(1) -> When -> Then(1)", async () => {
        const ticketsWereOffered: TicketsWereOffered = {
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

        const reserveTickets: ReserveTickets = {
            _named: "Reserve tickets!",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            basket: "basket:77fee20d-2bbf-461d-93a8-0cc3e74a1018",
            desiredNumberOfTickets: 2,
        };

        const ticketsWereReserved: TicketsWereReserved = {
            _named: "Tickets were reserved",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            basket: "basket:77fee20d-2bbf-461d-93a8-0cc3e74a1018",
            desiredNumberOfTickets: 2,
            reservedNumberOfTickets: 2,
        };

        return (new ExecutableSpecificationOfCommandHandler<AnyTicketingEvent, AnyTicketingCommand>())
            .given(ticketsWereOffered)
            .when(reserveTickets)
            .then(ticketsWereReserved)
            .execute(async (preConditions: AnyTicketingEvent[], trigger: AnyTicketingCommand, outcomes: AnyTicketingEvent[]) => {
                const expectedPreConditions = [ticketsWereOffered];
                const expectedTrigger = reserveTickets;
                const expectedOutcomes = [ticketsWereReserved];

                expect(preConditions).toStrictEqual(expectedPreConditions);
                expect(trigger).toStrictEqual(expectedTrigger);
                expect(outcomes).toStrictEqual(expectedOutcomes);
            });
    });

    test("Common specification: Given(1+N) -> When -> Then(1)", async () => {
        const ticketsWereOffered: TicketsWereOffered = {
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

        const firstTicketsWereReserved: TicketsWereReserved = {
            _named: "Tickets were reserved",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            basket: "basket:11111111-1111-1111-1111-111111111111",
            desiredNumberOfTickets: 2,
            reservedNumberOfTickets: 2,
        };

        const reserveTickets: ReserveTickets = {
            _named: "Reserve tickets!",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            basket: "basket:11111111-1111-1111-1111-111111111111",
            desiredNumberOfTickets: 2,
        };

        const moreTicketsWereReserved: TicketsWereReserved = {
            _named: "Tickets were reserved",
            ticketSaleId: "ticket-sale:63074afc-3c6d-451e-8eed-ccd2ce03e2c3",
            basket: "basket:22222222-2222-2222-2222-222222222222",
            desiredNumberOfTickets: 6,
            reservedNumberOfTickets: 6,
        };

        const preConditions = [ticketsWereOffered, firstTicketsWereReserved];
        const trigger = reserveTickets;
        const outcome = moreTicketsWereReserved;

        return (new ExecutableSpecificationOfCommandHandler<AnyTicketingEvent, AnyTicketingCommand>())
            .given(ticketsWereOffered, firstTicketsWereReserved)
            .when(reserveTickets)
            .then(moreTicketsWereReserved)
            .execute(async (givens: AnyTicketingEvent[], when: AnyTicketingCommand, thens: AnyTicketingEvent[]) => {
                const expectedGivens = preConditions;
                const expectedWhen = trigger;
                const expectedThens = outcome;

                expect(givens).toStrictEqual(expectedGivens);
                expect(when).toStrictEqual(expectedWhen);
                expect(thens).toStrictEqual(expectedThens);
            });
    });

    test("Common specification: Given(1+N) -> When -> Then(1+N)", async () => {
        const ticketsWereOffered: TicketsWereOffered = {
            _named: "Tickets were offered",
            ticketSaleId: "ticket-sale:0e382d88-6112-4fd0-9c21-7a5a432c7e35",
            ticketSellerId: "ticket-seller:9b079b1c-81b2-4acd-a1b6-75a10c08c595",
            eventDetails: {
                show: "Comedytrain Chefs Diner",
                scheduled: ["2026-06-28 18:30", "2026-06-28 22:00", "Europe/Amsterdam"],
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
            availableTickets: 15,
            priceInCents: [18250, "EUR"],
            offeredAt: ["2026-04-20 15:12:49", "Europe/Amsterdam"]
        };

        const firstTicketsWereReserved: TicketsWereReserved = {
            _named: "Tickets were reserved",
            ticketSaleId: "ticket-sale:0e382d88-6112-4fd0-9c21-7a5a432c7e35",
            basket: "basket:11111111-1111-1111-1111-111111111111",
            desiredNumberOfTickets: 6,
            reservedNumberOfTickets: 6,
        };

        const someTicketsWereReserved: TicketsWereReserved = {
            _named: "Tickets were reserved",
            ticketSaleId: "ticket-sale:0e382d88-6112-4fd0-9c21-7a5a432c7e35",
            basket: "basket:22222222-2222-2222-2222-222222222222",
            desiredNumberOfTickets: 6,
            reservedNumberOfTickets: 6,
        };

        const reserveTickets: ReserveTickets = {
            _named: "Reserve tickets!",
            ticketSaleId: "ticket-sale:0e382d88-6112-4fd0-9c21-7a5a432c7e35",
            basket: "basket:33333333-3333-3333-3333-333333333333",
            desiredNumberOfTickets: 3,
        };

        const moreTicketsWereReserved: TicketsWereReserved = {
            _named: "Tickets were reserved",
            ticketSaleId: "ticket-sale:0e382d88-6112-4fd0-9c21-7a5a432c7e35",
            basket: "basket:33333333-3333-3333-3333-333333333333",
            desiredNumberOfTickets: 3,
            reservedNumberOfTickets: 3,
        };

        const lastTicketsWereReserved: LastTicketsWereReserved = {
            _named: "Last tickets were reserved",
            ticketSaleId: "ticket-sale:0e382d88-6112-4fd0-9c21-7a5a432c7e35",
            totalNumberOfReservedTickets: 15,
        };

        const preConditions = [ticketsWereOffered, firstTicketsWereReserved, someTicketsWereReserved];
        const trigger = reserveTickets;
        const outcomes = [moreTicketsWereReserved, lastTicketsWereReserved];

        return (new ExecutableSpecificationOfCommandHandler<AnyTicketingEvent, AnyTicketingCommand>())
            .given(ticketsWereOffered, firstTicketsWereReserved, someTicketsWereReserved)
            .when(reserveTickets)
            .then(moreTicketsWereReserved, lastTicketsWereReserved)
            .execute(async (givens: AnyTicketingEvent[], when: AnyTicketingCommand, thens: AnyTicketingEvent[]) => {
                const expectedGivens = preConditions;
                const expectedWhen = trigger;
                const expectedThens = outcomes;

                expect(givens).toStrictEqual(expectedGivens);
                expect(when).toStrictEqual(expectedWhen);
                expect(thens).toStrictEqual(expectedThens);
            });
    });
});
