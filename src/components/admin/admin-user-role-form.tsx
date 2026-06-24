"use client";

import { useState } from "react";
import { updateUserRoleAction } from "@/actions/admin.actions";



interface AdminUserRoleFormProps {
  userId: string;
  currentRole: string;
}

export function AdminUserRoleForm({ userId, currentRole }: AdminUserRoleFormProps) {
  const [role, setRole] = useState(currentRole);
  const [status, setStatus] = useState<"idle" | "executing">("idle");

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    setRole(newRole);
    setStatus("executing");
    await updateUserRoleAction({ id: userId, role: newRole as "CUSTOMER" | "ADMIN" | "MANAGER" });
    setStatus("idle");
  };

  return (
    <select
      className="h-8 rounded-md border border-stone bg-transparent px-2 text-sm disabled:opacity-50 font-technical-mono"
      value={role}
      onChange={handleChange}
      disabled={status === "executing"}
    >
      <option value="CUSTOMER">CUSTOMER</option>
      <option value="MANAGER">MANAGER</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
