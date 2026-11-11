'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Messages } from '@/lib/i18n/messages/en';

const MessagesContext = createContext<Messages | null>(null);

/**
 * Hands the page's dictionary to client components. The layout passes in only
 * the current language's messages, so the others never reach the browser.
 */
export function I18nProvider({ messages, children }: { messages: Messages; children: ReactNode }) {
  return <MessagesContext value={messages}>{children}</MessagesContext>;
}

export function useMessages(): Messages {
  const messages = useContext(MessagesContext);
  if (!messages) throw new Error('useMessages() called outside <I18nProvider>');
  return messages;
}
