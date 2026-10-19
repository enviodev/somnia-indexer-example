import { indexer } from "envio";

indexer.onEvent(
  { contract: "USDCe", event: "Transfer" },
  async ({ event, context }) => {
    context.Transfer.set({
      id: `${event.transaction.hash}-${event.logIndex}`,
      from: event.params.from,
      to: event.params.to,
      value: event.params.value,
      blockNumber: BigInt(event.block.number),
      blockTimestamp: BigInt(event.block.timestamp),
      transactionHash: event.transaction.hash,
    });
  },
);
