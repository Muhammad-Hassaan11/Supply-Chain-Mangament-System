"use client";

import { useEffect, useState } from "react";
import { getStoredAccountName, getStoredAccountType } from "@/lib/api";

export function useStoredAccountState() {
  const [accountType, setAccountType] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setAccountType(getStoredAccountType());
    setAccountName(getStoredAccountName());
    setIsHydrated(true);
  }, []);

  return { accountType, accountName, isHydrated };
}
