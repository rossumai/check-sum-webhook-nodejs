# Example NodeJS Elis connector
Example [Elis](https://rossum.ai/data-capture#elis_page) connector that implements a simple check. It parses annotation structure and extracts field values (tax values and a total tax). Then it checks that values match and returns a warning message if not.

It expects following schema structure:

```yaml
amounts_section
  ...
  amount_total_tax
  ...
  vat_details
    ...
    vat_detail_tax
    ...
```

### Connector setup
Check out our [Developer Hub connector guide](https://developers.rossum.ai/docs/your-first-connector) on how to set up
an example connector for the first time. You can also [configure the connector using our API](https://api.elis.rossum.ai/docs/#create-a-new-connector)
directly.

To use this connector for production, use it via HTTPS and enforce the authentication token.
