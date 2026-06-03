"use client";

import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import Input from "@/components/Input";

interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  district?: string;
  countryCode: string;
  postalCode?: string;
  landMark?: string;
  isDefault: boolean;
}

const dummyAddresses: Address[] = [
  {
    id: "1",
    name: "Angela R",
    phone: "9187690560",
    line1: "XYZ Road, Southampton Street",
    city: "London",
    district: "Greater London",
    countryCode: "GB",
    postalCode: "SO14 3TB",
    landMark: "Near Central Station",
    isDefault: true,
  }
];

const initialFormState = {
  name: "",
  phone: "",
  line1: "",
  city: "",
  district: "",
  countryCode: "",
  postalCode: "",
  landMark: "",
  isDefault: false,
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialFormState);

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast("Address Deleted", { description: "The address has been removed." });
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Default Address Updated");
  };

  const handleSaveEdit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim() || !form.countryCode.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (editingId === "new") {
      // Adding new
      const newAddr: Address = {
        id: Date.now().toString(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        city: form.city.trim(),
        district: form.district.trim() || undefined,
        countryCode: form.countryCode.trim().toUpperCase(),
        postalCode: form.postalCode.trim() || undefined,
        landMark: form.landMark.trim() || undefined,
        isDefault: form.isDefault || addresses.length === 0, // default if it's the only one
      };

      let updatedAddresses = [...addresses];
      if (newAddr.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
      }
      setAddresses([...updatedAddresses, newAddr]);
      toast.success("Address Added");
    } else if (editingId) {
      // Editing existing
      let updatedAddresses = addresses.map(addr => 
        addr.id === editingId ? {
          ...addr,
          name: form.name.trim(),
          phone: form.phone.trim(),
          line1: form.line1.trim(),
          city: form.city.trim(),
          district: form.district.trim() || undefined,
          countryCode: form.countryCode.trim().toUpperCase(),
          postalCode: form.postalCode.trim() || undefined,
          landMark: form.landMark.trim() || undefined,
          isDefault: form.isDefault,
        } : addr
      );

      if (form.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === editingId ? addr : { ...addr, isDefault: false }
        );
      }
      setAddresses(updatedAddresses);
      toast.success("Address Updated");
    }
    
    setIsAdding(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      city: addr.city,
      district: addr.district || "",
      countryCode: addr.countryCode,
      postalCode: addr.postalCode || "",
      landMark: addr.landMark || "",
      isDefault: addr.isDefault,
    });
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId("new");
    setForm(initialFormState);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  const renderFormFields = () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="Full Name" 
          value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} 
          required 
          placeholder="e.g. Angela R"
        />
        <Input 
          label="Phone Number" 
          value={form.phone} 
          onChange={e => setForm({ ...form, phone: e.target.value })} 
          required 
          placeholder="e.g. 9187690560"
        />
      </div>
      <Input 
        label="Address Line 1" 
        value={form.line1} 
        onChange={e => setForm({ ...form, line1: e.target.value })} 
        required 
        placeholder="e.g. XYZ Road, Southampton Street"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input 
          label="City" 
          value={form.city} 
          onChange={e => setForm({ ...form, city: e.target.value })} 
          required 
          placeholder="e.g. London"
        />
        <Input 
          label="District (Optional)" 
          value={form.district} 
          onChange={e => setForm({ ...form, district: e.target.value })} 
          placeholder="e.g. Greater London"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input 
          label="Country Code" 
          value={form.countryCode} 
          onChange={e => setForm({ ...form, countryCode: e.target.value })} 
          required 
          maxLength={2}
          placeholder="e.g. SA"
        />
        <Input 
          label="Postal Code (Optional)" 
          value={form.postalCode} 
          onChange={e => setForm({ ...form, postalCode: e.target.value })} 
          placeholder="e.g. 12345"
        />
        <Input 
          label="Landmark (Optional)" 
          value={form.landMark} 
          onChange={e => setForm({ ...form, landMark: e.target.value })} 
          placeholder="e.g. Near Central Station"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer mt-2">
        <input 
          type="checkbox" 
          checked={form.isDefault} 
          onChange={e => setForm({ ...form, isDefault: e.target.checked })}
          className="w-4 h-4 accent-black rounded border-zinc-300"
        />
        <span className="text-sm font-sans text-black">Set as default address</span>
      </label>
    </div>
  );

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 lg:p-10 w-full min-h-150">
      <div className="mb-10">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">Address information</h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">
          Manage your Address information
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <p className="text-sm font-sans font-medium text-black">Add new Address</p>
        
        {/* Add Address Card */}
        {!isAdding && editingId !== "new" ? (
          <button 
            onClick={startAdd}
            className="w-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl p-8 hover:border-black/30 hover:bg-zinc-50 transition-colors text-zinc-400 group"
          >
            <FiPlus size={24} className="group-hover:text-black transition-colors" />
          </button>
        ) : (
          <div className="border border-black/20 rounded-xl p-6 bg-zinc-50 flex flex-col gap-4">
            {renderFormFields()}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={cancelEdit}
                className="px-4 py-2 text-xs font-sans font-semibold text-zinc-500 hover:text-black bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors flex items-center gap-2"
              >
                <FiX size={14} /> Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 text-xs font-sans font-semibold text-white bg-black rounded-md hover:bg-black/80 transition-colors flex items-center gap-2"
              >
                <FiCheck size={14} /> Save Address
              </button>
            </div>
          </div>
        )}

        {/* Existing Addresses */}
        <div className="flex flex-col gap-4">
          {addresses.map((addr) => {
            const isEditing = editingId === addr.id;
            
            if (isEditing) {
              return (
                <div key={addr.id} className="border border-black/20 rounded-xl p-6 bg-zinc-50 flex flex-col gap-4">
                  {renderFormFields()}
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={cancelEdit}
                      className="px-4 py-2 text-xs font-sans font-semibold text-zinc-500 hover:text-black bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors flex items-center gap-2"
                    >
                      <FiX size={14} /> Cancel
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="px-4 py-2 text-xs font-sans font-semibold text-white bg-black rounded-md hover:bg-black/80 transition-colors flex items-center gap-2"
                    >
                      <FiCheck size={14} /> Update Address
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={addr.id} className="border border-black/10 rounded-xl p-6 flex flex-col relative group">
                <div className="absolute top-6 right-6 flex items-center gap-3">
                  <button 
                    onClick={() => startEdit(addr)}
                    className="text-zinc-400 hover:text-black transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(addr.id)}
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                <div className="pr-16 mb-6">
                  <p className="font-semibold text-black font-sans text-sm mb-1">{addr.name}</p>
                  <p className="text-xs text-zinc-500 font-sans mb-3">{addr.phone}</p>
                  <p className="text-sm font-sans text-black leading-relaxed">
                    {addr.line1}
                  </p>
                  <p className="text-sm font-sans text-black leading-relaxed">
                    {addr.city}, {addr.district && `${addr.district}, `}{addr.countryCode} {addr.postalCode}
                  </p>
                  {addr.landMark && (
                    <p className="text-xs text-zinc-500 font-sans mt-2">
                      <span className="font-medium text-black">Landmark:</span> {addr.landMark}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-auto">
                  <button 
                    onClick={() => handleSetDefault(addr.id)}
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors focus:outline-none ${addr.isDefault ? 'border-black' : 'border-zinc-300 hover:border-black/50'}`}
                  >
                    {addr.isDefault && <div className="w-2 h-2 bg-black rounded-full"></div>}
                  </button>
                  <span className="text-sm font-sans text-black">Default Address</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
