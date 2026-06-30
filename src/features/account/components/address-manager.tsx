"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createAddressAction, deleteAddressAction, setDefaultAddressAction } from "@/actions/address.actions";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
};

export function AddressManager({ addresses: initial, userId }: { addresses: Address[]; userId: string }) {
  const [addresses, setAddresses] = useState<Address[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ label: "المنزل", fullName: "", phone: "", address: "", city: "", isDefault: false });

  function handleChange(k: keyof typeof form, v: string | boolean) {
    setForm(p => ({ ...p, [k]: v }));
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createAddressAction({ ...form, userId });
      if (result.success && result.address) {
        setAddresses(p => [...p, result.address as Address]);
        setShowForm(false);
        setForm({ label: "المنزل", fullName: "", phone: "", address: "", city: "", isDefault: false });
        toast.success("تم إضافة العنوان");
      } else {
        toast.error(result.error ?? "حدث خطأ");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteAddressAction(id);
      if (result.success) {
        setAddresses(p => p.filter(a => a.id !== id));
        toast.success("تم حذف العنوان");
      }
    });
  }

  function handleSetDefault(id: string) {
    startTransition(async () => {
      const result = await setDefaultAddressAction(id);
      if (result.success) {
        setAddresses(p => p.map(a => ({ ...a, isDefault: a.id === id })));
        toast.success("تم تعيين العنوان الافتراضي");
      }
    });
  }

  return (
    <div className="space-y-4">
      {addresses.map(a => (
        <div key={a.id} className={`border rounded-xl p-4 ${a.isDefault ? "border-tashtep-orange bg-orange-50/30" : "border-soft-border"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-obsidian text-sm">{a.label}</span>
                {a.isDefault && <span className="text-xs bg-tashtep-orange text-white px-2 py-0.5 rounded-full">افتراضي</span>}
              </div>
              <p className="text-sm text-secondary mt-1">{a.fullName} · {a.phone}</p>
              <p className="text-sm text-secondary">{a.address}، {a.city}</p>
            </div>
            <div className="flex gap-2">
              {!a.isDefault && (
                <button
                  onClick={() => handleSetDefault(a.id)}
                  disabled={isPending}
                  className="text-xs text-tashtep-orange hover:underline"
                >
                  تعيين افتراضي
                </button>
              )}
              <button
                onClick={() => handleDelete(a.id)}
                disabled={isPending}
                className="text-xs text-red-500 hover:underline"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      ))}

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-8 border border-dashed border-soft-border rounded-xl text-secondary">
          <span className="material-symbols-outlined text-4xl mb-2 block">location_on</span>
          لا توجد عناوين محفوظة
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleAdd} className="border border-soft-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-obsidian">عنوان جديد</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-secondary block mb-1">التسمية</label>
              <select value={form.label} onChange={e => handleChange("label", e.target.value)} className="w-full border border-soft-border rounded-lg px-3 py-2 text-sm">
                {["المنزل", "العمل", "آخر"].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">الاسم الكامل</label>
              <input required value={form.fullName} onChange={e => handleChange("fullName", e.target.value)} className="w-full border border-soft-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">رقم الهاتف</label>
              <input required value={form.phone} onChange={e => handleChange("phone", e.target.value)} className="w-full border border-soft-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">المدينة / المحافظة</label>
              <input required value={form.city} onChange={e => handleChange("city", e.target.value)} className="w-full border border-soft-border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-secondary block mb-1">العنوان التفصيلي</label>
              <input required value={form.address} onChange={e => handleChange("address", e.target.value)} className="w-full border border-soft-border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={e => handleChange("isDefault", e.target.checked)} className="accent-tashtep-orange" />
            تعيين كعنوان افتراضي
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={isPending} className="bg-tashtep-orange text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
              حفظ
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-soft-border">
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-tashtep-orange hover:underline font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
          إضافة عنوان جديد
        </button>
      )}
    </div>
  );
}
