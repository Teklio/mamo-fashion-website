"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiLoader, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Input from "@/components/Input";
import PhoneInput from "@/components/shared/PhoneInput";
import { SearchableDropdown } from "@/components/shared/SearchableDropdown";
import { useGetCountrycodes, useGetCities } from "@/services/settings.service";
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
  const [countrySearch, setCountrySearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<AddressFormType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      line1: "",
      countryCode: "",
      city: "",
      district: "",
      postalCode: "",
      landMark: "",
      isDefault: false,
    },
  });

  const watchedCountryCode = watch("countryCode");
  const watchedCity = watch("city");
  const watchedIsDefault = watch("isDefault");

  const { data: countrycodeData, isLoading: isCountriesLoading } = useGetCountrycodes(countrySearch);
  const { data: citiesData, isLoading: isCitiesLoading } = useGetCities(watchedCountryCode ?? "");

  const countryOptions = useMemo(
    () =>
      (countrycodeData?.countrycodes ?? []).map((c) => ({
        value: c.countrycode,
        label: `${c.countrycode} – ${c.name}`,
      })),
    [countrycodeData],
  );

  const cityOptions = useMemo(
    () => (citiesData ?? []).map((c) => ({ value: c.cityName, label: c.cityName })),
    [citiesData],
  );

  const addresses = data?.addresses ?? [];
  const isSaving = isAdding || isUpdating;
  const isOpen = editingId !== null;

  const openAdd = () => {
    setEditingId("new");
    setPhone("");
    reset({
      name: "",
      line1: "",
      countryCode: "",
      city: "",
      district: "",
      postalCode: "",
      landMark: "",
      isDefault: false,
    });
    setCountrySearch("");
  };

  const openEdit = (addr: CustomerAddress) => {
    setEditingId(addr.id);
    setPhone(addr.phone);
    reset({
      name: addr.name,
      line1: addr.line1,
      countryCode: addr.countryCode,
      city: addr.city,
      district: addr.district ?? "",
      postalCode: addr.postalCode ?? "",
      landMark: addr.landMark ?? "",
      isDefault: addr.isDefault,
    });
    setCountrySearch("");
  };

  const closeForm = () => {
    setEditingId(null);
    setPhone("");
    reset();
    setCountrySearch("");
  };

  const onSubmit = (data: AddressFormType) => {
    if (!phone.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    const payload: AddressPayload = {
      name: data.name,
      phone: phone.trim(),
      line1: data.line1,
      city: data.city,
      countryCode: data.countryCode,
      district: data.district?.trim() || null,
      postalCode: data.postalCode?.trim() || null,
      landMark: data.landMark?.trim() || null,
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
        {/* Country Code — controlled via setValue */}
        <div className="flex flex-col">
          <label className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase mb-2">
            Country Code *
          </label>
          <SearchableDropdown
            value={watchedCountryCode ?? ""}
            onChange={(v) => {
              setValue("countryCode", v, { shouldValidate: true, shouldDirty: true });
              setValue("city", "", { shouldDirty: true });
            }}
            options={countryOptions}
            placeholder="Select country"
            searchPlaceholder="Search country…"
            loading={isCountriesLoading}
            onSearchChange={setCountrySearch}
          />
          {errors.countryCode && (
            <p className="mt-1 text-xs text-red-500">{errors.countryCode.message}</p>
          )}
        </div>

        {/* City — controlled via setValue */}
        <div className="flex flex-col">
          <label className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase mb-2">
            City *
          </label>
          <SearchableDropdown
            value={watchedCity ?? ""}
            onChange={(v) => setValue("city", v, { shouldValidate: true, shouldDirty: true })}
            options={cityOptions}
            placeholder={watchedCountryCode ? "Select city" : "Select country first"}
            searchPlaceholder="Search city…"
            loading={isCitiesLoading}
            disabled={!watchedCountryCode}
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
          )}
        </div>
      </div>

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

        {/* Phone — outside RHF; combined code + number */}
        <PhoneInput
          label="PHONE *"
          value={phone}
          onChange={setPhone}
          placeholder="50 123 4567"
        />
      </div>

      <div>
        <Input
          label="Address Line 1 *"
          placeholder="e.g. XYZ Road, Southampton Street"
          {...register("line1")}
        />
        {errors.line1 && (
          <p className="mt-1 text-xs text-red-500">{errors.line1.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="District (optional)"
          placeholder="e.g. Greater London"
          {...register("district")}
        />
        <Input
          label="Postal Code (optional)"
          placeholder="e.g. 12345"
          {...register("postalCode")}
        />
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
                    <p className="text-sm font-sans text-black leading-relaxed">{addr.line1}</p>
                    <p className="text-sm font-sans text-black leading-relaxed">
                      {addr.city}
                      {addr.district ? `, ${addr.district}` : ""}
                      {`, ${addr.countryCode}`}
                      {addr.postalCode ? ` ${addr.postalCode}` : ""}
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
                {deletingAddr.line1}, {deletingAddr.city}, {deletingAddr.countryCode}
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
