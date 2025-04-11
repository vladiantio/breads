// source: https://github.com/akari-blue/akari/blob/main/src/lib/bluesky/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AtpAgent, { AtpSessionData, Agent } from '@atproto/api';

export type AtpCredentials = {
  handle: string;
  password: string;
  authFactorToken?: string;
};

type Session = AtpSessionData & {
  didDoc?:
    | {
        service: {
          id: string;
          serviceEndpoint: string;
          type: 'AtprotoPersonalDataServer';
        }[];
      }
    | undefined;
};

type AtpState = {
  agent: Agent;
  isAuthenticated: boolean;
  session: Session | null;
  login: (credentials: AtpCredentials) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
};

const AUTHENTICATED_ENDPOINT = 'https://bsky.social';
const GUEST_ENDPOINT = 'https://api.bsky.app';

export const useAtpStore = create<AtpState>()(
  persist(
    (set, get) => ({
      agent: new Agent({ service: GUEST_ENDPOINT }),
      isAuthenticated: false,

      login: async (credentials: AtpCredentials) => {
        const agent = new Agent({ service: AUTHENTICATED_ENDPOINT });
        const response = await agent.com.atproto.server.createSession({
          identifier: credentials.handle,
          password: credentials.password,
          authFactorToken: credentials.authFactorToken,
          allowTakendown: true,
        });

        // Store session data
        const session = response.data;
        set({
          agent,
          isAuthenticated: true,
          session: {
            ...session,
            active: true,
            didDoc: session.didDoc as Session['didDoc'],
          },
        });
      },

      logout: () => {
        set({
          agent: new Agent({ service: GUEST_ENDPOINT }),
          isAuthenticated: false,
          session: null
        });
        // reload the page after logout
        window.location.reload();
      },

      restoreSession: async () => {
        const { session, isAuthenticated } = get();
        if (session && !isAuthenticated) {
          try {
            const agent = new AtpAgent({ service: AUTHENTICATED_ENDPOINT });
            await agent.resumeSession(session);
            set({ agent, isAuthenticated: true });
          } catch (error) {
            console.error('Failed to restore session:', error);
            set({ agent: new Agent({ service: GUEST_ENDPOINT }), isAuthenticated: false, session: null });
          }
        }
      },

      session: null,
    }),
    {
      name: 'atp-store',
      partialize: (state) => ({ session: state.session }),
    },
  ),
);
