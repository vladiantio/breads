// source: https://github.com/akari-blue/akari/blob/main/src/lib/bluesky/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AtpSessionData,
  Agent,
  CredentialSession,
} from '@atproto/api';
import {
  AUTHENTICATED_ENDPOINT,
  PUBLIC_ENDPOINT,
} from './constants/endpoints';

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
  credentialSession: CredentialSession;
  agent: Agent;
  isAuthenticated: boolean;
  session: Session | null;
  login: (credentials: AtpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const useAtpStore = create<AtpState>()(
  persist(
    (set, get) => ({
      credentialSession: createPublicSession(),
      agent: new Agent(createPublicSession()),
      isAuthenticated: false,

      login: async (credentials: AtpCredentials) => {
        const { credentialSession, session } = await loginAndCreateAuthenticatedSession(credentials);
        const agent = new Agent(credentialSession);

        // Store session data
        set({
          agent,
          credentialSession,
          isAuthenticated: true,
          session: {
            ...session,
            active: true,
            didDoc: session.didDoc as Session['didDoc'],
          },
        });
      },

      logout: async () => {
        const { credentialSession } = get();
        await credentialSession.logout();
        const newCredentialSession = createPublicSession();
        const agent = new Agent(newCredentialSession);
        set({
          agent,
          credentialSession: newCredentialSession,
          isAuthenticated: false,
          session: null
        });
        // reload the page after logout
        window.location.reload();
      },

      restoreSession: async () => {
        const { session, isAuthenticated } = get();
        if (session !== null && !isAuthenticated) {
          try {
            const credentialSession = await resumeSession(session);
            const agent = new Agent(credentialSession);
            set({
              agent,
              credentialSession,
              isAuthenticated: true
            });
          } catch (error) {
            const credentialSession = createPublicSession();
            const agent = new Agent(credentialSession);
            console.error('Failed to restore session:', error);
            set({
              agent,
              credentialSession,
              isAuthenticated: false,
              session: null
            });
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

function createPublicSession() {
  return new CredentialSession(new URL(PUBLIC_ENDPOINT));
}

async function loginAndCreateAuthenticatedSession(credentials: AtpCredentials) {
  const credentialSession = new CredentialSession(new URL(AUTHENTICATED_ENDPOINT));
  const { data: session } = await credentialSession.login({
    identifier: credentials.handle,
    password: credentials.password,
    authFactorToken: credentials.authFactorToken,
    allowTakendown: true,
  });
  return { credentialSession, session };
}

async function resumeSession(session: AtpSessionData) {
  const credentialSession = new CredentialSession(new URL(AUTHENTICATED_ENDPOINT));
  await credentialSession.resumeSession(session);
  return credentialSession;
}
