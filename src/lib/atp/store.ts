// source: https://github.com/akari-blue/akari/blob/main/src/lib/bluesky/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, ok, simpleFetchHandler } from '@atcute/client';
import {
  CompositeDidDocumentResolver,
  LocalActorResolver,
  PlcDidDocumentResolver,
  WebDidDocumentResolver,
  XrpcHandleResolver,
} from '@atcute/identity-resolver';
import {
  OAuthUserAgent,
  configureOAuth,
  createAuthorizationUrl,
  deleteStoredSession,
  finalizeAuthorization,
  getSession,
} from '@atcute/oauth-browser-client';
import { PUBLIC_ENDPOINT } from './constants/endpoints';
import type { ActorIdentifier, Did } from '@atcute/lexicons';

// `configureOAuth` spins up atcute's session database, which uses the Web Locks
// API (`navigator.locks`) to serialize session mutations across documents. Web
// Locks only exists in secure contexts, so on plain-HTTP origins — e.g. Chrome
// Mobile reaching the dev server through the Android emulator alias `10.0.2.2`
// or a LAN IP instead of `127.0.0.1` — calling it during module evaluation
// throws and blanks the whole app. Skip it when the API is missing so anonymous
// browsing still works from any origin; auth entry points fail with a clear error.
const isOAuthAvailable = (): boolean =>
  typeof globalThis.navigator !== 'undefined' &&
  typeof globalThis.navigator.locks !== 'undefined';

if (isOAuthAvailable()) {
  configureOAuth({
    metadata: {
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
    },
    identityResolver: new LocalActorResolver({
      handleResolver: new XrpcHandleResolver({ serviceUrl: PUBLIC_ENDPOINT }),
      didDocumentResolver: new CompositeDidDocumentResolver({
        methods: {
          plc: new PlcDidDocumentResolver(),
          web: new WebDidDocumentResolver(),
        },
      }),
    }),
  });
} else {
  console.warn(
    '[atp] OAuth unavailable: the Web Locks API requires a secure context ' +
      '(https, localhost, or 127.0.0.1). Login is disabled on this origin.',
  );
}

function createClient(agent?: OAuthUserAgent): Client {
  return new Client({
    handler: agent ?? simpleFetchHandler({ service: PUBLIC_ENDPOINT }),
  });
}

type AtpState = {
  client: Client;
  did: string | null;
  handle: string | null;
  isAuthenticated: boolean;
  startAuth: (identifier: string) => Promise<void>;
  finalizeAuth: (params: URLSearchParams) => Promise<string>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAtpStore = create<AtpState>()(
  persist(
    (set, get) => ({
      client: createClient(),
      did: null,
      handle: null,
      isAuthenticated: false,

      startAuth: async (identifier: string) => {
        if (!isOAuthAvailable()) {
          throw new Error(
            'Login requires a secure connection. Open the app from localhost/127.0.0.1 or HTTPS on this device.',
          );
        }

        const authUrl = await createAuthorizationUrl({
          target: { type: 'account', identifier: identifier as ActorIdentifier },
          scope: import.meta.env.VITE_OAUTH_SCOPE,
        });

        // let the browser persist the auth flow's local storage before navigating away
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.assign(authUrl);
      },

      finalizeAuth: async (params: URLSearchParams) => {
        const { session } = await finalizeAuthorization(params);
        const agent = new OAuthUserAgent(session);
        const client = createClient(agent);

        const data = await ok(client.get('com.atproto.server.getSession'));

        set({
          client,
          did: data.did,
          handle: data.handle,
          isAuthenticated: true,
        });

        return data.did;
      },

      logout: async () => {
        const { did } = get();
        if (did) {
          try {
            const session = await getSession(did as Did, { allowStale: true });
            const agent = new OAuthUserAgent(session);
            await agent.signOut();
          } catch {
            try {
              deleteStoredSession(did as Did);
            } catch {
              // OAuth may be unavailable (non-secure context); nothing to clean up
            }
          }
        }

        set({
          client: createClient(),
          did: null,
          handle: null,
          isAuthenticated: false,
        });
        // reload the page after logout
        window.location.reload();
      },

      restoreSession: async () => {
        const { did, isAuthenticated } = get();
        if (did === null || isAuthenticated) {
          return;
        }
        try {
          const session = await getSession(did as Did, { allowStale: true });
          const agent = new OAuthUserAgent(session);
          const client = createClient(agent);

          const data = await ok(client.get('com.atproto.server.getSession'));

          set({
            client,
            did: data.did,
            handle: data.handle,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Failed to restore session:', error);
          set({
            client: createClient(),
            did: null,
            handle: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'atcute-oauth',
      partialize: (state) => ({ did: state.did, handle: state.handle }),
    },
  ),
);
