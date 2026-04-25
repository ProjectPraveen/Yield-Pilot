'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CalculatorType } from '@/types';

export function useSaveCalculation() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const supabase = createClient();

  const save = useCallback(async ({
    type,
    name,
    summary,
    resultValue,
    inputs,
  }: {
    type: CalculatorType;
    name: string;
    summary: string;
    resultValue: string;
    inputs?: Record<string, unknown>;
  }) => {
    setSaving(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Redirect to sign in
      window.location.href = '/sign-in';
      setSaving(false);
      return false;
    }

    const { error } = await supabase
      .from('saved_calculations')
      .insert({
        user_id: user.id,
        type,
        name,
        summary,
        result_value: resultValue,
        inputs: inputs ?? null,
      });

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return true;
    }
    return false;
  }, [supabase]);

  return { save, saving, saved };
}
