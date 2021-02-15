const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 3000
const PORT = process.env.PORT || 3000;

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
// console.log(stripeSecretKey, stripePublicKey);

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
