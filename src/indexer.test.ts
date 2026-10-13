import { describe, it } from "vitest";
import { createTestIndexer, TestHelpers } from "envio";

const { Addresses } = TestHelpers;

describe("USDC transfers on Somnia", () => {
  it("indexes a real USDC transfer from Somnia Mainnet", async (t) => {
    const indexer = createTestIndexer();

    // Block 437549011 has one USDC transfer (tx 0x59347c1e...)
    await indexer.process({
      chains: {
        5031: { startBlock: 437_549_011, endBlock: 437_549_011 },
      },
    });

    const transfer = await indexer.Transfer.getOrThrow(
      "0x59347c1e1a4d67bb1b334248d44b284c570f3bb612468bf11a7b231f47e3bed1-0",
    );

    t.expect(transfer).toEqual({
      id: "0x59347c1e1a4d67bb1b334248d44b284c570f3bb612468bf11a7b231f47e3bed1-0",
      from: "0xe5467Be8B8Db6B074904134E8C1a581F5565E2c3",
      to: "0xE8d579973Db8e95E8FF0F5CE41B373ED10858Ac2",
      value: 39865370n,
      blockNumber: 437549011n,
      blockTimestamp: 1791908871n,
      transactionHash:
        "0x59347c1e1a4d67bb1b334248d44b284c570f3bb612468bf11a7b231f47e3bed1",
    });
  });

  it("saves one Transfer per simulated event", async (t) => {
    const indexer = createTestIndexer();
    const [from, to] = Addresses.mockAddresses;

    await indexer.process({
      chains: {
        5031: {
          simulate: [
            {
              contract: "USDC",
              event: "Transfer",
              params: { from: from!, to: to!, value: 1_000_000n },
            },
          ],
        },
      },
    });

    const transfers = await indexer.Transfer.getAll();
    t.expect(transfers).toHaveLength(1);
    t.expect(transfers[0]).toMatchObject({ from, to, value: 1_000_000n });
  });
});
