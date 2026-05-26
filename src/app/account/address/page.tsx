"use client";

import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { toast } from "sonner";

interface Address {
  id: number;
  address: string;
  isDefault: boolean;
}

const dummyAddresses: Address[] = [
  {
    id: 1,
    address: "XYZ Road, Southampton Street, London",
    isDefault: true,
  }
];

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>(dummyAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
    toast("Address Deleted", { description: "The address has been removed." });
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success("Default Address Updated");
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) return;
    
    if (editingId === 0) {
      // Adding new
      const newAddr: Address = {
        id: Date.now(),
        address: editValue,
        isDefault: addresses.length === 0, // default if it's the only one
      };
      setAddresses([...addresses, newAddr]);
      toast.success("Address Added");
    } else {
      // Editing existing
      setAddresses(addresses.map(addr => 
        addr.id === editingId ? { ...addr, address: editValue } : addr
      ));
      toast.success("Address Updated");
    }
    
    setIsAdding(false);
    setEditingId(null);
    setEditValue("");
  };

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setEditValue(addr.address);
    setIsAdding(false);
  };

  const startAdd = () => {
    setEditingId(0);
    setEditValue("");
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-8 lg:p-10 w-full min-h-150">
      <div className="mb-10">
        <h1 className="font-serif text-2xl lg:text-3xl text-black mb-2">Address information</h1>
        <p className="text-zinc-500 font-sans text-sm">
          Manage your Address information
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl">
        <p className="text-sm font-sans font-medium text-black">Add new Address</p>
        
        {/* Add Address Card */}
        {!isAdding && editingId !== 0 ? (
          <button 
            onClick={startAdd}
            className="w-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl p-8 hover:border-black/30 hover:bg-zinc-50 transition-colors text-zinc-400 group"
          >
            <FiPlus size={24} className="group-hover:text-black transition-colors" />
          </button>
        ) : (
          <div className="border border-black/20 rounded-xl p-6 bg-zinc-50 flex flex-col gap-4">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Enter your full address..."
              className="w-full p-4 border border-zinc-200 rounded-md focus:outline-none focus:border-black/30 min-h-25 resize-y text-sm font-sans text-black"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button 
                onClick={cancelEdit}
                className="px-4 py-2 text-xs font-sans font-semibold text-zinc-500 hover:text-black bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors flex items-center gap-2"
              >
                <FiX size={14} /> Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={!editValue.trim()}
                className="px-4 py-2 text-xs font-sans font-semibold text-white bg-black rounded-md hover:bg-black/80 disabled:opacity-50 transition-colors flex items-center gap-2"
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
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full p-4 border border-zinc-200 rounded-md focus:outline-none focus:border-black/30 min-h-25 resize-y text-sm font-sans text-black"
                    autoFocus
                  />
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={cancelEdit}
                      className="px-4 py-2 text-xs font-sans font-semibold text-zinc-500 hover:text-black bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 transition-colors flex items-center gap-2"
                    >
                      <FiX size={14} /> Cancel
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      disabled={!editValue.trim()}
                      className="px-4 py-2 text-xs font-sans font-semibold text-white bg-black rounded-md hover:bg-black/80 disabled:opacity-50 transition-colors flex items-center gap-2"
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
                
                <p className="text-sm font-sans text-black pr-16 mb-8 leading-relaxed whitespace-pre-wrap">
                  {addr.address}
                </p>
                
                <div className="flex items-center gap-2">
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
