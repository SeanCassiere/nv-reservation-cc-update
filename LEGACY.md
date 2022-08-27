# Authorizing with the legacy API

```javascript
const clientId = "ABCD";

fetch("https://app.navotar.com/api/Login/GetClientSecretToken", {
  method: "POST",
  body: JSON.stringify({
    ClientId: clientId,
    ConsumerType: "Admin,Basic",
  }),
}).then(function (response) {
  return response.json();
});
```
