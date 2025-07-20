import { useState, useEffect } from 'react';
import { supabase } from '../service/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setAuthLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setAuthLoading(false);
        return { data, error };
    };

    const signUp = async (email: string, password: string) => {
        setAuthLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        setAuthLoading(false);
        return { data, error };
    };

    const signOut = async () => {
        setAuthLoading(true);
        const { error } = await supabase.auth.signOut();
        setAuthLoading(false);
        return { error };
    };

    const handleGoogleSignIn = async () => {
        setAuthLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        setAuthLoading(false);
        return { data, error };
    };

    return {
        session,
        user,
        loading,
        authLoading,
        signIn,
        signUp,
        signOut,
        handleGoogleSignIn
    };
}