# Example JavaScript Elis connector
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
You can use [elisctl](https://github.com/rossumai/elisctl) tool to configure an Elis queue to use the connector.

Create the connector first:

```
	 elisctl connector create "JavaScript Example Connector" --service-url http://hostname:5000 --auth-token wuNg0OenyaeK4eenOovi7aiF
```

In the response, you will receive the ID of the connector. Next, choose an existing queue and deploy the connector to it:

```
	 elisctl queue change 29582 --connector-id 1506
```

Or create a new queue and attach the connector to it:

```
	 elisctl queue create "JavaScript Connector Queue" --connector-id 1506 -s schema.json
```

You can also [configure the connector using our API](https://api.elis.rossum.ai/docs/#create-a-new-connector) directly.
