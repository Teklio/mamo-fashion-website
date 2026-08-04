"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Input from "@/components/Input";
import {
  useGetCustomerAddresses,
  useAddCustomerAddress,
  useUpdateCustomerAddress,
  useDeleteCustomerAddress,
  type CustomerAddress,
  type AddressPayload,
} from "@/services/address.service";
import { addressSchema, type AddressFormType } from "@/zodschemas/address.schema";
import type { AxiosError } from "axios";

export default function AddressPage() {
  const { data, isLoading } = useGetCustomerAddresses();
  const { mutate: addAddress, isPending: isAdding } = useAddCustomerAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateCustomerAddress();
  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteCustomerAddress();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingAddr, setDeletingAddr] = useState<CustomerAddress | null>(null);
  const [phone, setPhone] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      line1: "",
      city: "",
      district: "",
      pinCode: "",
      landMark: "",
      isDefault: false,
    },
  });

  const watchedIsDefault = useWatch({ control, name: "isDefault" });

  const addresses = data?.addresses ?? [];
  const isSaving = isAdding || isUpdating;
  const isOpen = editingId !== null;

  const openAdd = () => {
    setEditingId("new");
    setPhone("");
    reset({
      name: "",
      line1: "",
      city: "",
      district: "",
      pinCode: "",
      landMark: "",
      isDefault: false,
    });
  };

  const openEdit = (addr: CustomerAddress) => {
    setEditingId(addr.id);
    setPhone(addr.phone);
    reset({
      name: addr.name,
      line1: addr.line1 ?? "",
      city: addr.city,
      district: addr.district ?? "",
      pinCode: addr.pinCode ?? "",
      landMark: addr.landMark ?? "",
      isDefault: addr.isDefault,
    });
  };

  const closeForm = () => {
    setEditingId(null);
    setPhone("");
    reset();
  };

  const onSubmit = (data: AddressFormType) => {
    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error("Enter a valid 10-digit phone number.");
      return;
    }

    const payload: AddressPayload = {
      name: data.name,
      phone: phone.trim(),
      city: data.city,
      district: data.district.trim(),
      pinCode: data.pinCode.trim(),
      ...(data.line1?.trim() ? { line1: data.line1.trim() } : {}),
      ...(data.landMark?.trim() ? { landMark: data.landMark.trim() } : {}),
      isDefault: data.isDefault,
    };

    const onError = (err: unknown) => {
      const axiosErr = err as AxiosError<{ message: string }>;
      toast.error(axiosErr.response?.data?.message || "Something went wrong");
    };

    if (editingId === "new") {
      addAddress(payload, {
        onSuccess: () => { toast.success("Address added successfully"); closeForm(); },
        onError,
      });
    } else if (editingId) {
      updateAddress(
        { id: editingId, payload },
        {
          onSuccess: () => { toast.success("Address updated successfully"); closeForm(); },
          onError,
        },
      );
    }
  };

  const handleSetDefault = (id: string) => {
    updateAddress(
      { id, payload: { isDefault: true } },
      {
        onSuccess: () => toast.success("Default address updated"),
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string }>;
          toast.error(axiosErr.response?.data?.message || "Failed to update");
        },
      },
    );
  };

  const confirmDelete = () => {
    if (!deletingAddr) return;
    deleteAddress(deletingAddr.id, {
      onSuccess: () => { toast("Address deleted"); setDeletingAddr(null); },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(axiosErr.response?.data?.message || "Failed to delete");
        setDeletingAddr(null);
      },
    });
  };

  const renderForm = (submitLabel: string) => (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-black/20 rounded-xl p-6 bg-zinc-50 flex flex-col gap-4"
    >


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Full Name *"
            placeholder="e.g. Angela R"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Input
            label="PHONE *"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="9876543210"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Address Line 1"
            placeholder="e.g. XYZ Road, Southampton Street"
            {...register("line1")}
          />
          {errors.line1 && (
            <p className="mt-1 text-xs text-red-500">{errors.line1.message}</p>
          )}
        </div>
        <div>
          <Input
            label="City *"
            placeholder="e.g. London"
            {...register("city")}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            label="District *"
            placeholder="e.g. Greater London"
            {...register("district")}
          />
          {errors.district && (
            <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
          )}
        </div>
        <div>
          <Input
            label="Pin Code *"
            placeholder="e.g. 12345"
            {...register("pinCode")}
          />
          {errors.pinCode && (
            <p className="mt-1 text-xs text-red-500">{errors.pinCode.message}</p>
          )}
        </div>
        <Input
          label="Landmark (optional)"
          placeholder="e.g. Near Central Station"
          {...register("landMark")}
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer mt-1">
        <input
          type="checkbox"
          checked={watchedIsDefault ?? false}
          onChange={(e) => setValue("isDefault", e.target.checked, { shouldDirty: true })}
          className="w-4 h-4 accent-black rounded border-zinc-300"
        />
        <span className="text-sm font-sans text-black">Set as default address</span>
      </label>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={closeForm}
          disabled={isSaving}
          className="px-4 py-2 text-xs font-sans font-semibold text-zinc-500 hover:text-black bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <FiX size={14} /> Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || (editingId !== "new" && !isDirty && phone === (addresses.find(a => a.id === editingId)?.phone ?? ""))}
          className="px-4 py-2 text-xs font-sans font-semibold text-white bg-black rounded-md hover:bg-black/80 transition-colors flex items-center gap-2 disabled:opacity-40"
        >
          {isSaving ? <FiLoader size={14} className="animate-spin" /> : <FiCheck size={14} />}
          {submitLabel}
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 lg:p-10 w-full min-h-150">
      <div className="mb-10">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">
          Address Information
        </h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">
          Manage your saved shipping addresses
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        {/* Add new */}
        {editingId === "new" ? (
          renderForm("Save Address")
        ) : (
          <button
            onClick={openAdd}
            className="w-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl p-8 hover:border-black/30 hover:bg-zinc-50 transition-colors text-zinc-400 group"
          >
            <FiPlus size={24} className="group-hover:text-black transition-colors" />
          </button>
        )}

        {/* Existing addresses */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {addresses.map((addr) => {
              if (editingId === addr.id) {
                return <div key={addr.id}>{renderForm("Update Address")}</div>;
              }

              return (
                <div
                  key={addr.id}
                  className="border border-black/10 rounded-xl p-6 flex flex-col relative group"
                >
                  <div className="absolute top-6 right-6 flex items-center gap-3">
                    <button
                      onClick={() => !isOpen && openEdit(addr)}
                      disabled={isOpen}
                      className="text-zinc-400 hover:text-black transition-colors disabled:opacity-30"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeletingAddr(addr)}
                      className="text-zinc-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="pr-16 mb-6">
                    <p className="font-semibold text-black font-sans text-sm mb-1">{addr.name}</p>
                    <p className="text-xs text-zinc-500 font-sans mb-3">{addr.phone}</p>
                    {addr.line1 && (
                      <p className="text-sm font-sans text-black leading-relaxed">{addr.line1}</p>
                    )}
                    <p className="text-sm font-sans text-black leading-relaxed">
                      {addr.city}
                      {addr.district ? `, ${addr.district}` : ""}
                      {addr.pinCode ? ` ${addr.pinCode}` : ""}
                    </p>
                    {addr.landMark && (
                      <p className="text-xs text-zinc-500 font-sans mt-2">
                        <span className="font-medium text-black">Landmark:</span> {addr.landMark}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => !addr.isDefault && handleSetDefault(addr.id)}
                      disabled={addr.isDefault || isUpdating}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors focus:outline-none ${
                        addr.isDefault
                          ? "border-black cursor-default"
                          : "border-zinc-300 hover:border-black/50 cursor-pointer"
                      }`}
                    >
                      {addr.isDefault && <div className="w-2 h-2 bg-black rounded-full" />}
                    </button>
                    <span className="text-sm font-sans text-black">
                      {addr.isDefault ? "Default Address" : "Set as default"}
                    </span>
                  </div>
                </div>
              );
            })}

            {addresses.length === 0 && !isLoading && editingId !== "new" && (
              <p className="text-sm text-zinc-400 font-sans text-center py-4">
                No saved addresses yet. Add one above.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingAddr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeletingAddr(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-7 flex flex-col items-center"
            >
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
                <FiAlertTriangle size={22} />
              </div>

              <h3 className="font-serif text-xl text-black mb-2 text-center">Delete Address</h3>
              <p className="text-zinc-500 font-sans text-sm text-center mb-1">
                Are you sure you want to delete this address?
              </p>
              <p className="text-zinc-800 font-sans text-xs text-center font-medium mb-7">
                {deletingAddr.line1 ? `${deletingAddr.line1}, ` : ""}
                {deletingAddr.city}, {deletingAddr.pinCode}
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeletingAddr(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-sans font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-sans font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isDeleting && <FiLoader size={13} className="animate-spin" />}
                  {isDeleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
