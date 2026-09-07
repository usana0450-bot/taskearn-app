import { TelegramUser, TelegramWebApp } from '../types';

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

export function isRunningInTelegram(): boolean {
  const webApp = getTelegramWebApp();
  return Boolean(webApp && webApp.initDataUnsafe?.user);
}

// Fallback user for web browser or AI Studio iframe preview
export const DEFAULT_MOCK_TELEGRAM_USER: TelegramUser = {
  id: 84920412,
  first_name: 'Alex',
  last_name: 'Vance',
  username: 'alexvance_tg',
  language_code: 'en',
  is_premium: true,
  photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
};

export function getTelegramUser(): TelegramUser {
  const webApp = getTelegramWebApp();
  if (webApp && webApp.initDataUnsafe?.user) {
    return webApp.initDataUnsafe.user;
  }
  // Check localStorage for simulated profile override during browser testing
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('taskearn_simulated_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore fallback
      }
    }
  }
  return DEFAULT_MOCK_TELEGRAM_USER;
}

export function setSimulatedUser(user: TelegramUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('taskearn_simulated_user', JSON.stringify(user));
  }
}

export function getTelegramInitData(): string {
  const webApp = getTelegramWebApp();
  return webApp?.initData || '';
}

export function initTelegramApp() {
  const webApp = getTelegramWebApp();
  if (!webApp) return;

  try {
    webApp.ready();
    webApp.expand();
    if (typeof webApp.setHeaderColor === 'function') {
      webApp.setHeaderColor('#080c14');
    }
    if (typeof webApp.setBackgroundColor === 'function') {
      webApp.setBackgroundColor('#080c14');
    }
  } catch (err) {
    console.warn('Telegram WebApp init warning:', err);
  }
}

// Haptic feedback wrappers
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' | 'warning' = 'light') {
  const webApp = getTelegramWebApp();
  if (!webApp?.HapticFeedback) return;

  try {
    if (type === 'selection') {
      webApp.HapticFeedback.selectionChanged();
    } else if (type === 'success' || type === 'error' || type === 'warning') {
      webApp.HapticFeedback.notificationOccurred(type);
    } else {
      webApp.HapticFeedback.impactOccurred(type);
    }
  } catch (err) {
    console.debug('Haptic feedback error:', err);
  }
}

// Telegram BackButton helper
export function setupBackButton(onBack: () => void, isVisible: boolean) {
  const webApp = getTelegramWebApp();
  if (!webApp?.BackButton) return () => {};

  try {
    if (isVisible) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onBack);
      return () => {
        webApp.BackButton.offClick(onBack);
        webApp.BackButton.hide();
      };
    } else {
      webApp.BackButton.hide();
      return () => {};
    }
  } catch {
    return () => {};
  }
}

export function openExternalLink(url: string) {
  const webApp = getTelegramWebApp();
  if (webApp) {
    if (url.startsWith('https://t.me/') || url.startsWith('tg://')) {
      webApp.openTelegramLink(url);
    } else {
      webApp.openLink(url);
    }
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
