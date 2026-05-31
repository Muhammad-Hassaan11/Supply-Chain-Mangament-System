"use client";

import { useAuth } from "@/context/AuthContext";
import { useStoredAccountState } from "@/lib/useStoredAccountState";
import { ClientProfilePage } from "@/components/client/ClientPortal";

export default function ClientProfileRoutePage() {
  const { user } = useAuth();
  const { accountName } = useStoredAccountState();
  return <ClientProfilePage accountName={accountName} userEmail={user?.email} />;
}
