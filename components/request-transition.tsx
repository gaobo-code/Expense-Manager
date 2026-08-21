"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";

function isPrefetchRequest(input: RequestInfo | URL, init?: RequestInit) {
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((value, key) => headers.set(key, value));

  return headers.get("next-router-prefetch") === "1"
    || headers.get("purpose")?.toLowerCase() === "prefetch"
    || headers.get("sec-purpose")?.toLowerCase().includes("prefetch") === true;
}

function isBackendRequest(input: RequestInfo | URL) {
  const rawUrl = input instanceof Request ? input.url : String(input);

  try {
    const url = new URL(rawUrl, window.location.href);
    if (url.origin === window.location.origin) {
      return !url.pathname.startsWith("/_next/static/")
        && !url.pathname.startsWith("/_next/image")
        && !url.pathname.startsWith("/favicon.ico");
    }

    return url.hostname.endsWith(".supabase.co")
      || url.hostname === "localhost" && url.port === "54321";
  } catch {
    return false;
  }
}

function isMutationRequest(input: RequestInfo | URL, init?: RequestInit) {
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  return method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
}

export function RequestTransition() {
  const [visible, setVisible] = useState(false);
  const activeRequests = useRef(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const message = language === "zh" ? "处理中，请稍候…" : "Processing, please wait…";

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    const begin = () => {
      activeRequests.current += 1;
      if (activeRequests.current === 1) setVisible(true);
    };

    const end = () => {
      activeRequests.current = Math.max(0, activeRequests.current - 1);
      if (activeRequests.current === 0) setVisible(false);
    };

    window.fetch = (input, init) => {
      const tracked = isBackendRequest(input)
        && isMutationRequest(input, init)
        && !isPrefetchRequest(input, init);
      if (tracked) begin();

      try {
        const request = originalFetch(input, init);
        return tracked ? request.finally(end) : request;
      } catch (error) {
        if (tracked) end();
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlayRef.current?.focus({ preventScroll: true });

    const blockKeyboard = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const keepFocusBlocked = (event: FocusEvent) => {
      if (!overlayRef.current?.contains(event.target as Node)) {
        overlayRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", blockKeyboard, true);
    document.addEventListener("focusin", keepFocusBlocked, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", blockKeyboard, true);
      document.removeEventListener("focusin", keepFocusBlocked, true);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [visible]);

  return (
    <div
      ref={overlayRef}
      className="request-transition"
      data-visible={visible ? "true" : "false"}
      role={visible ? "status" : undefined}
      aria-live="assertive"
      aria-label={message}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <div className="request-transition__bar" />
      <div className="request-transition__veil">
        <div className="request-transition__loader" aria-hidden="true" />
        <p>{message}</p>
      </div>
    </div>
  );
}
