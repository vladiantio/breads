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
            deleteStoredSession(did as Did);
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
