import { useState, useEffect } from 'react';

const USERS_KEY = 'careerexplore_local_users';
const SESSION_KEY = 'careerexplore_local_session';

export const auth = {
  signIn: async ({ email, password }: any) => {
    await new Promise(r => setTimeout(r, 500));
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const session = { user: { id: user.id, email: user.email, user_metadata: user.metadata || {} } };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      notifySubscribers('SIGNED_IN', session);
      return { data: { session }, error: null };
    }
    return { data: null, error: { message: "Invalid login credentials" } };
  },

  signUp: async ({ email, password, options }: any) => {
    await new Promise(r => setTimeout(r, 500));
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return { data: null, error: { message: "User already registered" } };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      metadata: options?.data || {}
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const session = { user: { id: newUser.id, email: newUser.email, user_metadata: newUser.metadata } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySubscribers('SIGNED_IN', session);
    
    return { data: { session }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem(SESSION_KEY);
    notifySubscribers('SIGNED_OUT', null);
    return { error: null };
  },

  getSession: async () => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return { data: { session: sessionStr ? JSON.parse(sessionStr) : null } };
  },

  onAuthStateChange: (callback: any) => {
    const subId = subscribe(callback);
    
    const sessionStr = localStorage.getItem(SESSION_KEY);
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);

    return { data: { subscription: { unsubscribe: () => unsubscribe(subId) } } };
  }
};

const subscribers = new Map();

function subscribe(callback: any) {
  const id = crypto.randomUUID();
  subscribers.set(id, callback);
  return id;
}

function unsubscribe(id: any) {
  subscribers.delete(id);
}

function notifySubscribers(event: string, session: any) {
  for (const callback of subscribers.values()) {
    callback(event, session);
  }
}
