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
