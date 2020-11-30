# Example NodeJS Rossum Webhook
Example [Rossum](https://rossum.ai) webhook that implements a simple check.
It parses annotation structure and extracts field values (amount_total_tax and tax_detail_tax).
Then it checks that values match and returns a warning message if not.

An example annotation also used for testing:

```yaml
test/data/sample-data.json
```

### Start
Start writing your code by cloning this project and adjusting the
```yaml
webhook.js
```
Use the supporting functions available in the utils directory.

### Webhook setup
You can find more information about webhooks at our [Developer Hub](https://developers.rossum.ai/docs/how-to-use-webhooks).
To set the webhook up, use the attached Dockerfile and our [guide](https://developers.rossum.ai/docs/run-extension-microservice).
You can also configure a Rossum queue to use the webhook via UI or using our [API](https://api.elis.rossum.ai/docs/#webhook-extension).
Or you can use [elisctl](https://github.com/rossumai/elisctl) tool as described in the guide.

To use the webhook for production, run via HTTPS using, for example, Nginx proxy with Let's encrypt
TLS/SSL certificate.
