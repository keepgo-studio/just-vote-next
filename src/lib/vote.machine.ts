import {
  ageGroupsEnum,
  candidatesEnum,
  genderEnum,
  regionsEnum,
  type VoteAgeGroup,
  type VoteCandidate,
  type VoteGender,
  type VoteRegion,
} from "@/lib/vars";
import {
  type ActorRefFrom,
  assign,
  fromPromise,
  setup,
  type StateFrom,
} from "xstate";
import { createVote, updateVote, type CreateVoteParams } from "./actions";
import { z } from "zod";

type Context = {
  isUpdate: boolean;
} & NullableFields<CreateVoteParams>;

type Events =
  | { type: "START_VOTE"; userId: string }
  | { type: "END_VOTE" }
  | { type: "CHOOSE_AGE"; value: VoteAgeGroup }
  | { type: "CHOOSE_REGION"; value: VoteRegion }
  | { type: "CHOOSE_GENDER"; value: VoteGender }
  | { type: "CHOOSE_CANDIDATE"; value: VoteCandidate }
  | { type: "CHOOSE_PRIORITY"; value: number }
  | { type: "UPDATE_ALL"; data: CreateVoteParams }
  | { type: "VOTE" }
  ;

export const voteSchema = z.object({
  userId: z.string(),
  gender: z.enum(genderEnum),
  ageGroup: z.enum(ageGroupsEnum),
  region: z.enum(regionsEnum),
  voteFor: z.enum(candidatesEnum),
  priority: z.number(),
});

export function assertVoteContextValid(ctx: unknown): asserts ctx is CreateVoteParams {
  const result = voteSchema.safeParse(ctx);
  if (!result.success) {
    throw new Error("Invalid vote context: " + result.error.message);
  }
}

const voteActor = fromPromise<void, { context: Context }>(async ({ input }) => {
  const { context } = input;

  assertVoteContextValid(context);

  if (context.isUpdate) {
    await updateVote(context);
  } else {
    await createVote(context);
  }
});

export const voteMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },
  actions: {
    assignUserId: assign({
      userId: (_, params: { userId: string }) => params.userId,
    }),
    assignGender: assign({
      gender: (_, params: { value: VoteGender }) => params.value,
    }),
    assignAgeGroup: assign({
      ageGroup: (_, params: { value: VoteAgeGroup }) => params.value,
    }),
    assignRegion: assign({
      region: (_, params: { value: VoteRegion }) => params.value,
    }),
    assignVoteFor: assign({
      voteFor: (_, params: { value: VoteCandidate }) => params.value,
    }),
    assignPriority: assign({
      priority: (_, params: { value: number }) => params.value,
    }),
    assignAll: assign({
      userId: (_, params: { data: CreateVoteParams }) => params.data.userId,
      gender: (_, params: { data: CreateVoteParams }) => params.data.gender,
      ageGroup: (_, params: { data: CreateVoteParams }) => params.data.ageGroup,
      region: (_, params: { data: CreateVoteParams }) => params.data.region,
      voteFor: (_, params: { data: CreateVoteParams }) => params.data.voteFor,
      priority: (_, params: { data: CreateVoteParams }) => params.data.priority,
      isUpdate: () => true
    })
  },
  actors: {
    voteActor,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcD2AXMBiAogOQBEB9ANQHkAVHAbQAYBdRUAB1VgEt13UA7JkAB6IA7ADYAjADoAnMIBM48QGZFAVlGi5cgDQgAnonVLJ44bVVjpC0bRUBfO7rSYsAVQAKBAIJUiXgDL+dIxIIKwcXLz8Qgiq4gAsklpyosLi6vG0ABzxqroGCNJZ0pJKwqrWqlmqtPHC8Q5OGNgAwgASZGQAyjh+AOI0DPzhnNx8oTFKSrQmVdlp5bT1SvmI8fFS4nLxcmamNvXmjSDOrR3dvQBKOH0AkmR4wcNso1ETiEpaknXmZmXToiUWVWCBsxi26WkVShCW2x1OWHanR6RHcl3u6IoAE0nqERpFxqAYrlwbYssIsuIigkNiCslkZuJ6RS5KorMJpID4c1EecUQNCDhLriWC8CdEPnIZqI5mkFEtqtsQRyZqzlFlRJkJHIrNyXEiLkQWl5CLdvFQRWExWMJQhpsJJMVtqZtkpMm6VvpELJEpqGT7WTLsnrsOQLUM8da3kSPhpJDUmVNamYqqp4iDxNksvG5NNybVaJysnIQ5J2DxOFguhQvJcKKRKIMQqKIjb3ghlCU06INYWabVRBmOaUGWzaClNPFpLrHCdmpJnOWoFgILwwGWeGgANbr06W-FtmN2qcyFRT6RUrYSQdejvpB2ZHLlVLmdaqUuLnjLsAAJx-qB-SRmAAGwAQ3QAAzACAFsF2afco0JQQPh2SQNCnbYKisVQqgzKls3WcQe1oGxOVsUtf3-H9cEIBtw2bK1W2jZDQULEwzCyD1ikpBIMwUYwqi2BNASZUtVx4bABFgdBwPXUCIMwH8AAopVoWgAEosFOSRxLABCmKQmIJAfKVqlIjYxHEPCKkkbJUimGVPlqBpjh4VAIDgfhTmeAzbTiNDyXiYp1jEMxASHJIUinbsiOUHVhFLctOB815DMQUxjFSJkqjlKUVGEDNakkeRHLiMQ4mw0sAGMAAtUDYMAvBgS5QK-MAUvFdstkSEqcMI0iiM9AodVEWypg2JQ2UybIS1nbTavq2AwEuMAoEPRjUttZQHVodIJCseJARI6QhrWQFHRqYtNG2XMdWquqGr6MAeA8n8OvWmJlFUJIPWEPM4hw+kQU0GZxz+tJu2nXbqtQaCQLATB3uYmJykSLQKXWDZAXiKY8NQos2UmsoGSBD8MCXJG0sKEoe3qYK6hfcLb0UJQSkOtkbGczi0wov8AMpvylkdLQwTkHILH2PjduKmw2RyXZdlEub5wWhqWlaiB2AgWSBa67Y0NZNStgOnCKTpLYZGEDk6isI2SPuxawHcH9uBd9AChbTausmtCtUTQ43SZEFpwdMo6kwsWpVmppMB0tddaPGoHRSFV5BVE7dmsmYqlSHYgtSCR3wcOwgA */
  id: "vote",

  initial: "init",

  context: {
    userId: null,
    gender: null,
    ageGroup: null,
    region: null,
    priority: null,
    voteFor: null,
    isUpdate: false
  },

  states: {
    init: {
      on: {
        START_VOTE: {
          target: "chooseAgeRange",
          actions: {
            type: "assignUserId",
            params: ({ event }) => ({ userId: event.userId }),
          },
        }
      },
    },

    chooseAgeRange: {},

    chooseRegion: {},

    chooseGender: {},

    complete: {
      type: "final",
    },

    voting: {
      invoke: {
        src: "voteActor",
        id: "vote",
        onDone: {
          target: "done",
          reenter: true
        },
        onError: "error",
        input: ({ context }) => ({ context }),
      },
    },

    error: {
      on: {
        END_VOTE: "complete"
      },
    },

    chooseCandidate: {},

    choosePriority: {},

    done: {
      after: {
        "2000": "complete"
      }
    }
  },

  on: {
    END_VOTE: ".complete",

    UPDATE_ALL: {
      target: ".choosePriority",

      actions: {
        type: "assignAll",
        params: ({ event }) => ({ ...event })
      },

      reenter: true
    },

    CHOOSE_AGE: {
      target: ".chooseRegion",

      actions: {
        type: "assignAgeGroup",
        params: ({ event }) => ({ ...event }),
      }
    },

    CHOOSE_REGION: {
      target: ".chooseGender",

      actions: {
        type: "assignRegion",
        params: ({ event }) => ({ ...event }),
      }
    },

    CHOOSE_PRIORITY: {
      target: ".choosePriority",

      actions: {
        type: "assignPriority",
        params: ({ event }) => ({ ...event }),
      }
    },

    CHOOSE_GENDER: {
      target: ".chooseCandidate",

      actions: {
        type: "assignGender",
        params: ({ event }) => ({ value: event.value }),
      }
    },

    CHOOSE_CANDIDATE: {
      target: ".choosePriority",

      actions: {
        type: "assignVoteFor",
        params: ({ event }) => ({ ...event }),
      }
    },

    VOTE: ".voting"
  }
});

export type VoteActorRef = ActorRefFrom<typeof voteMachine>;

export type VoteActorState = StateFrom<typeof voteMachine>["value"];
