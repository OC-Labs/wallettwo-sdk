# WalletTwo SDK

A React SDK for integrating WalletTwo authentication and blockchain transactions into your application.

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
    <WalletTwoProvider>
      <YourApp />
    </WalletTwoProvider>
  );
}
```

## Components

### WalletTwoProvider

The root provider component that handles authentication and user session management.

**Props:**
- `children`: React.ReactNode - Your application components
- `loader?`: React.ReactNode - Custom loading component (optional)
- `disableLoader?`: boolean - Disable the loading state (optional)

```tsx
<WalletTwoProvider loader={<CustomLoader />}>
  <App />
</WalletTwoProvider>
```

### AuthAction

Button component that triggers user authentication.

```tsx
import { AuthAction } from '@oc-labs/wallettwo-sdk';

<AuthAction />
```

### TransactionAction

Button component that triggers blockchain transactions.

**Props:**
- `network`: string - Network chain ID (e.g., "80002" for Polygon Amoy)
- `methods`: string[] - Contract method names to call
- `params`: any[][] - Parameters for each method
- `addresses`: string[] - Contract addresses
- `abis`: string[] - Contract ABI names
- `waitTx?`: boolean - Wait for transaction confirmation (optional)
- `onSuccess?`: (txId: string) => void - Success callback
- `onFailure?`: (error: any) => void - Failure callback
- `onCancel?`: () => void - Cancel callback

```tsx
import { TransactionAction } from '@oc-labs/wallettwo-sdk';

<TransactionAction 
  network="80002" 
  methods={['faucet']} 
  params={[[]]} 
  addresses={['0xfa86C7c30840694293a5c997f399d00A4eD3cDD8']} 
  waitTx={true}
  abis={['ERC20Faucet']}
  onSuccess={(txId) => console.log("Success:", txId)}
  onFailure={(error) => console.error("Error:", error)}
  onCancel={() => console.log("Cancelled")}
/>
```

### RampAction

Button component for on/off ramp operations.

```tsx
import { RampAction } from '@oc-labs/wallettwo-sdk';

<RampAction />
```

### SignatureAction

Button component for signing messages.

```tsx
import { SignatureAction } from '@oc-labs/wallettwo-sdk';

<SignatureAction />
```

### LogoutAction

Button component for user logout.

```tsx
import { LogoutAction } from '@oc-labs/wallettwo-sdk';

<LogoutAction />
```

## Hooks

### useWalletTwo

Access WalletTwo functionality programmatically.

```tsx
import { useWalletTwo } from '@oc-labs/wallettwo-sdk';

function MyComponent() {
  const { user, headlessLogin, loadUserFromToken, logout } = useWalletTwo();

  return (
    <div>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Returns:**
- `user`: User object or null
- `headlessLogin()`: Initialize headless authentication
- `loadUserFromToken(token: string)`: Load user from access token
- `logout()`: Log out the current user

## Example

```tsx
import { 
  WalletTwoProvider, 
  AuthAction, 
  TransactionAction,
  LogoutAction,
  useWalletTwo 
} from '@oc-labs/wallettwo-sdk';

function App() {
  return (
    <WalletTwoProvider>
      <MyApp />
    </WalletTwoProvider>
  );
}

function MyApp() {
  const { user } = useWalletTwo();

  return (
    <div>
      {!user ? (
        <AuthAction />
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          <TransactionAction 
            network="80002" 
            methods={['transfer']} 
            params={[['0x...', '1000000']]} 
            addresses={['0x...']} 
            abis={['ERC20']}
            onSuccess={(txId) => alert('Transaction successful!')}
          />
          <LogoutAction />
        </>
      )}
    </div>
  );
}
```

## License

See repository for license information.
