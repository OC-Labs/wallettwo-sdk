# WalletTwo SDK - Onchainlabs

A React SDK for integrating WalletTwo wallet authentication, blockchain transactions, message signing, and on/off ramp operations into your application. All wallet interactions happen through secure iframes — no Web3 libraries required on your end.

## Installation

```bash
npm install @oc-labs/wallettwo-sdk
```

## Quick Start

Wrap your app with `WalletTwoProvider`:

```tsx
import { WalletTwoProvider } from '@oc-labs/wallettwo-sdk';

function App() {
  return (
    <WalletTwoProvider companyId="your-company-id">
      <YourApp />
    </WalletTwoProvider>
  );
}
```

## Components

### WalletTwoProvider

Root provider that manages authentication state, headless login, and the transaction modal.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `React.ReactNode` | Yes | Your application |
| `companyId` | `string` | No | Your company identifier, sent on every iframe request |
| `loader` | `React.ReactNode` | No | Custom loading UI shown during initialization |
| `disableLoader` | `boolean` | No | Skip the loading state entirely |

```tsx
<WalletTwoProvider companyId="my-company" loader={<Spinner />}>
  <App />
</WalletTwoProvider>
```

### AuthAction

Renders an authentication iframe. Automatically hides when the user is already logged in.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onAuth` | `(accessToken: string) => void` | No | Called after successful authentication with the access token |
| `autoAccept` | `boolean` | No | When `true`, appends `auto_accept=true` to the iframe URL to skip manual confirmation |

```tsx
import { AuthAction } from '@oc-labs/wallettwo-sdk';

<AuthAction onAuth={(token) => console.log("Authenticated:", token)} autoAccept />
```

### TransactionAction

Renders an iframe for executing blockchain transactions. Only renders when a user is logged in.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `transactions` | `Transaction[]` | No | Array of transactions to execute |
| `network` | `string` | No | Chain ID (defaults to `"137"` — Polygon) |
| `onSuccess` | `(transactionId: string) => void` | No | Called on successful execution |
| `onFailure` | `(error: string) => void` | No | Called on failure |
| `onCancel` | `() => void` | No | Called when user cancels |
| `onExecuting` | `() => void` | No | Called when transactions begin executing |

Each `Transaction` object:

```ts
{
  method: string;      // Contract method name
  address: string;     // Contract address
  params: unknown[];   // Method parameters
  abi?: unknown;       // Optional ABI
}
```

```tsx
import { TransactionAction } from '@oc-labs/wallettwo-sdk';

<TransactionAction
  network="137"
  transactions={[
    {
      method: 'transfer',
      address: '0x...',
      params: ['0xRecipient', '1000000'],
      abi: ERC20_ABI
    }
  ]}
  onSuccess={(txId) => console.log("TX:", txId)}
  onFailure={(error) => console.error(error)}
  onCancel={() => console.log("Cancelled")}
/>
```

### SignatureAction

Renders an iframe for signing messages. Only renders when a user is logged in and a message is provided.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | The message to sign |
| `onSignature` | `(signature: string) => void` | No | Called with the resulting signature |
| `autoAccept` | `boolean` | No | When `true`, appends `auto_accept=true` to the iframe URL to skip manual confirmation |

```tsx
import { SignatureAction } from '@oc-labs/wallettwo-sdk';

<SignatureAction
  message="Please sign this message to verify ownership"
  onSignature={(sig) => console.log("Signature:", sig)}
  autoAccept
/>
```

### LogoutAction

Renders an iframe that logs the user out. Only renders when a user is logged in.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onLogout` | `() => void` | No | Called after successful logout |
| `autoAccept` | `boolean` | No | When `true`, appends `auto_accept=true` to the iframe URL to skip manual confirmation |

```tsx
import { LogoutAction } from '@oc-labs/wallettwo-sdk';

<LogoutAction onLogout={() => console.log("Logged out")} autoAccept />
```

### RampAction

Renders an iframe for on/off ramp operations (buy/sell crypto). Only renders when a user is logged in.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onRampSuccess` | `(transactionId: string) => void` | No | Called on successful ramp |
| `onRampFailure` | `(error: string) => void` | No | Called on failure |
| `onRampCancel` | `() => void` | No | Called when user cancels |

```tsx
import { RampAction } from '@oc-labs/wallettwo-sdk';

<RampAction
  onRampSuccess={(txId) => console.log("Ramp complete:", txId)}
  onRampFailure={(err) => console.error(err)}
  onRampCancel={() => console.log("Cancelled")}
/>
```

## Hooks

### useWalletTwo

Programmatic access to all WalletTwo functionality.

```tsx
import { useWalletTwo } from '@oc-labs/wallettwo-sdk';

const {
  user,                // User | null — current authenticated user ({ id, email })
  token,               // string | null — current access token
  headlessLogin,       // () => void — trigger silent background login
  loadUserFromToken,   // (token: string) => Promise<void> — load user from an existing token
  signMessage,         // (message: string) => Promise<string> — sign a message (30s timeout)
  executeTransaction,  // (params) => void — open the transaction modal
  logout,              // () => Promise<void> — log out the user (10s timeout)
} = useWalletTwo();
```

#### executeTransaction

Opens a modal with a TransactionAction iframe:

```tsx
executeTransaction({
  network: '137',
  transactions: [
    { method: 'transfer', address: '0x...', params: ['0x...', '1000000'] }
  ],
  onSuccess: (txId) => console.log(txId),
  onFailure: (error) => console.error(error),
  onCancel: () => console.log('Cancelled'),
  onExecuting: () => console.log('Executing...'),
});
```

#### signMessage

Signs a message using a headless iframe and returns a promise:

```tsx
try {
  const signature = await signMessage("Verify wallet ownership");
  console.log("Signature:", signature);
} catch (err) {
  console.error("Timed out or failed");
}
```

## Full Example

```tsx
import {
  WalletTwoProvider,
  AuthAction,
  LogoutAction,
  useWalletTwo,
} from '@oc-labs/wallettwo-sdk';

function App() {
  return (
    <WalletTwoProvider companyId="my-company">
      <Wallet />
    </WalletTwoProvider>
  );
}

function Wallet() {
  const { user, executeTransaction, signMessage } = useWalletTwo();

  if (!user) {
    return <AuthAction onAuth={(token) => console.log("Logged in")} />;
  }

  return (
    <div>
      <p>Welcome, {user.email}</p>

      <button onClick={() => executeTransaction({
        network: '137',
        transactions: [{
          method: 'transfer',
          address: '0xTokenAddress',
          params: ['0xRecipient', '1000000'],
        }],
        onSuccess: (txId) => alert(`TX: ${txId}`),
      })}>
        Send Transaction
      </button>

      <button onClick={async () => {
        const sig = await signMessage("Hello WalletTwo");
        console.log(sig);
      }}>
        Sign Message
      </button>

      <LogoutAction onLogout={() => console.log("Bye")} />
    </div>
  );
}
```

## Configuration

Set `VITE_WALLETTWO_URL` to override the default API base URL (`https://api.wallettwo.com`):

```env
VITE_WALLETTWO_URL=https://your-custom-api.com
```

## License

See repository for license information.
