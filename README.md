# Somnia Indexer Example

An [Envio HyperIndex](https://docs.envio.dev/docs/HyperIndex/overview) indexer that saves every `Transfer` event of [USDC on Somnia Mainnet](https://explorer.somnia.network/address/0x28BEc7E30E6faee657a03e19Bf1128AaD7632A00) and serves it through a GraphQL API.

It is the finished project from the "Indexing Somnia with Envio" tutorial in the [Somnia docs](https://docs.somnia.network/developer/building-dapps/data-indexing-and-querying).

## Prerequisites

- The tools listed in the [HyperIndex prerequisites](https://docs.envio.dev/docs/HyperIndex/quickstart#prerequisites), with Docker running
- An Envio API token from [envio.dev/app/api-tokens](https://envio.dev/app/api-tokens)

## Run

```bash
pnpm install
cp .env.example .env # then add your ENVIO_API_TOKEN
pnpm codegen
pnpm dev
```

![The indexer syncing Somnia Mainnet and reaching the latest block](assets/envio-somnia-sync.gif)

Open the Hasura console at http://localhost:8080 and log in with the admin secret `testing`. The GraphQL endpoint is `http://localhost:8080/v1/graphql`.

```graphql
query {
  Transfer(limit: 10, order_by: { blockNumber: desc }) {
    from
    to
    value
    blockTimestamp
    transactionHash
  }
}
```

Stop the indexer with `Ctrl+C`. Run `pnpm envio stop` to remove the local Docker containers.

## Test

```bash
pnpm test
```

The tests process a real USDC transfer from Somnia Mainnet and a simulated one. The GitHub workflow in `.github/workflows/test.yaml` runs them on every push and pull request. Add `ENVIO_API_TOKEN` to the repository secrets for it to work.

## Files

- `config.yaml` sets the chain (`5031`, Somnia Mainnet), the USDC address, the start block and the `Transfer` event.
- `schema.graphql` defines the `Transfer` entity.
- `src/handlers/USDC.ts` saves one `Transfer` row per event.

`start_block` is set to a recent block so the first sync finishes quickly. Set it to `83645688`, the block of the first USDC transfer on Somnia, to index the full history.

## Somnia Testnet

To index a contract on Somnia Testnet, use chain ID `50312` and set the HyperSync URL in `config.yaml`.

```yaml
chains:
  - id: 50312 # Somnia Testnet
    hypersync_config:
      url: https://50312.hypersync.xyz
    start_block: 0 # replace with your contract's deployment block
    contracts:
      - name: USDC
        address: "0xYourTestnetContractAddress"
```

## Learn more

- [Envio docs](https://docs.envio.dev/docs/HyperIndex/overview)
- [Deploy to Envio Cloud](https://docs.envio.dev/docs/HyperIndex/hosted-service)
- [Migrate from a subgraph](https://docs.envio.dev/docs/HyperIndex/migration-guide)
- [Envio Discord](https://discord.gg/envio)
