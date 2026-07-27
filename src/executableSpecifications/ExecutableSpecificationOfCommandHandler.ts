export type ExecuteScenario<AnyEvent, AnyCommand> = (givens: AnyEvent[], when: AnyCommand, thens: AnyEvent[]) => Promise<void>;

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

export class WhenStepOfExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
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

export class ExecutableSpecificationOfCommandHandler<AnyEvent, AnyCommand> {
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
