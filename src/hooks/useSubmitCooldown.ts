import { useCallback, useEffect, useState } from "react";

/**
 * Throttles repeated form submissions on the client.
 *
 * After `start()` is called, `secondsLeft` counts down from `cooldownSeconds`
 * and the consumer can disable the submit button while it is > 0. The deadline
 * is persisted in localStorage under `storageKey`, so a page reload does not
 * reset the cooldown — a user can't bypass it by refreshing.
 *
 * This is a UX/abuse guard for real users; bots that hit the API directly are
 * handled server-side (rate limit + honeypot + dedup).
 */
const useSubmitCooldown = (storageKey: string, cooldownSeconds = 60) => {
  const [secondsLeft, setSecondsLeft] = useState(0);

  const readDeadline = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem(storageKey);
    const deadline = raw ? parseInt(raw, 10) : 0;
    if (!deadline || Number.isNaN(deadline)) return 0;
    return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  }, [storageKey]);

  // Restore any cooldown that is still active (e.g. after a reload).
  useEffect(() => {
    setSecondsLeft(readDeadline());
  }, [readDeadline]);

  // Tick down once per second while a cooldown is active.
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft(readDeadline());
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft, readDeadline]);

  const start = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, String(Date.now() + cooldownSeconds * 1000));
    }
    setSecondsLeft(cooldownSeconds);
  }, [storageKey, cooldownSeconds]);

  return { secondsLeft, isCoolingDown: secondsLeft > 0, start };
};

export default useSubmitCooldown;
