"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiChevronDown, FiCheck, FiChevronRight, FiFilter, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts } from "@/services/product.service";
import ProductCard from "@/components/ProductCard";

export default function ShopGrid() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Accordion states
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);

  const [minPriceInput, setMinPriceInput] = useState<number | "">("");
  const [maxPriceInput, setMaxPriceInput] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"low-to-high" | "high-to-low" | "bestseller" | "new-arrivals">("low-to-high");

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<string | null>(null);

  const [appliedMin, setAppliedMin] = useState<number | undefined>(undefined);
  const [appliedMax, setAppliedMax] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetProducts({
    minPrice: appliedMin,
    maxPrice: appliedMax,
    isAscending: sortBy === "low-to-high",
  });

  const variants = data?.variants ?? [];

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileFilterOpen]);

  const handleApplyPriceFilters = () => {
    setAppliedMin(minPriceInput !== "" ? minPriceInput : undefined);
    setAppliedMax(maxPriceInput !== "" ? maxPriceInput : undefined);
  };

  const handleClearFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedMin(undefined);
    setAppliedMax(undefined);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setActiveSizes([]);
    setActiveColor(null);
    setActiveMaterial(null);
  };

  // Local filtering based on new fields since API is mocked
  const filteredVariants = useMemo(() => {
    let result = [...variants];

    if (activeCategory) {
      result = result.filter(v => v.mainCategory === activeCategory);
    }
    if (activeSubcategory) {
      result = result.filter(v => v.subCategory === activeSubcategory);
    }
    if (activeColor) {
      result = result.filter(v => v.colorName?.toLowerCase().includes(activeColor.toLowerCase()));
    }
    if (activeMaterial) {
      result = result.filter(v => v.material === activeMaterial);
    }
    if (activeSizes.length > 0) {
      result = result.filter(v => v.sizes.some(s => activeSizes.includes(s.size)));
    }

    if (sortBy === "high-to-low") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "low-to-high") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    return result;
  }, [variants, activeCategory, activeSubcategory, activeColor, activeMaterial, activeSizes, sortBy]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const categories = {
    Women: ["prayer set", "shawl", "cotton knistic", "co-ord set", "3 piece set", "2 piece set", "Kuftan Nighties", "korean Nighties", "Cotton Nighties", "frock Nighties"],
    Kids: ["Daily wear", "dusty wear", "korean nighties", "prayer dress"]
  };

  const filterColors = [
    { name: "White", code: "#ffffff" },
    { name: "Pink", code: "#ffb6c1" },
    { name: "Blue", code: "#3b5998" },
    { name: "Rose", code: "#dcae96" },
    { name: "Navy", code: "#000080" },
  ];

  const allSizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

  // Reusable Filter Sidebar Content (stored as JSX, NOT a component, to avoid remounting)
  const filterContent = (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-200">
        <h3 className="text-lg font-serif text-zinc-900">Filters</h3>
        <button onClick={handleClearFilters} className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-900">
          Reset
        </button>
      </div>

      {/* Categories Accordion */}
      <div className="border-b border-zinc-200 pb-4">
        <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex items-center justify-between w-full text-xs font-bold tracking-widest text-zinc-900 font-sans uppercase mb-2">
          <span>Category</span>
          <FiChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isCategoryOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2 pt-2">
              {Object.entries(categories).map(([main, subs]) => (
                <div key={main} className="space-y-1">
                  <button 
                    onClick={() => {
                      setActiveCategory(activeCategory === main ? null : main);
                      setActiveSubcategory(null);
                    }}
                    className={`flex items-center justify-between w-full text-sm font-sans py-1.5 transition-colors ${activeCategory === main ? "font-bold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"}`}
                  >
                    {main}
                    <FiChevronRight size={14} className={`transition-transform ${activeCategory === main ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeCategory === main && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 space-y-1"
                      >
                        {subs.map(sub => (
                          <button
                            key={sub}
                            onClick={() => setActiveSubcategory(activeSubcategory === sub ? null : sub)}
                            className={`block w-full text-left text-xs font-sans py-1.5 transition-colors ${activeSubcategory === sub ? "font-semibold text-zinc-900" : "text-zinc-500 hover:text-zinc-800"}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Size Accordion */}
      <div className="border-b border-zinc-200 pb-4">
        <button onClick={() => setIsSizeOpen(!isSizeOpen)} className="flex items-center justify-between w-full text-xs font-bold tracking-widest text-zinc-900 font-sans uppercase mb-2">
          <span>Size</span>
          <FiChevronDown size={14} className={`transition-transform duration-300 ${isSizeOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isSizeOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2">
              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <label key={size} className="cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={activeSizes.includes(size)}
                      onChange={() => {
                        setActiveSizes(prev => 
                          prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                        );
                      }} 
                    />
                    <div className={`w-10 h-10 rounded-sm border flex items-center justify-center transition-all ${activeSizes.includes(size) ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-500'}`}>
                      <span className="text-xs font-sans font-medium">{size}</span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Accordion */}
      <div className="border-b border-zinc-200 pb-4">
        <button onClick={() => setIsPriceOpen(!isPriceOpen)} className="flex items-center justify-between w-full text-xs font-bold tracking-widest text-zinc-900 font-sans uppercase mb-2">
          <span>Price (INR)</span>
          <FiChevronDown size={14} className={`transition-transform duration-300 ${isPriceOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isPriceOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900"
                />
                <span className="text-zinc-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900"
                />
              </div>
              <button
                onClick={handleApplyPriceFilters}
                className="w-full py-2 bg-zinc-900 text-white rounded-lg text-[10px] font-sans font-bold tracking-widest uppercase hover:bg-black transition-colors"
              >
                Apply Price
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Color Accordion */}
      <div className="border-b border-zinc-200 pb-4">
        <button onClick={() => setIsColorOpen(!isColorOpen)} className="flex items-center justify-between w-full text-xs font-bold tracking-widest text-zinc-900 font-sans uppercase mb-2">
          <span>Color</span>
          <FiChevronDown size={14} className={`transition-transform duration-300 ${isColorOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isColorOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2">
              <div className="flex flex-col gap-3">
                {filterColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setActiveColor(activeColor === color.name ? null : color.name)}
                    className="flex items-center space-x-3 group text-left w-fit"
                  >
                    <div 
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${activeColor === color.name ? 'border-zinc-900 scale-110' : 'border-zinc-300 group-hover:border-zinc-500'}`}
                    >
                      <div 
                        className="w-4 h-4 rounded-full shadow-inner"
                        style={{ backgroundColor: color.code }}
                      />
                    </div>
                    <span className={`text-sm font-sans transition-colors ${activeColor === color.name ? "text-zinc-900 font-bold" : "text-zinc-600 group-hover:text-zinc-900"}`}>
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Material Accordion */}
      <div className="pb-2">
        <button onClick={() => setIsMaterialOpen(!isMaterialOpen)} className="flex items-center justify-between w-full text-xs font-bold tracking-widest text-zinc-900 font-sans uppercase mb-2">
          <span>Material</span>
          <FiChevronDown size={14} className={`transition-transform duration-300 ${isMaterialOpen ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {isMaterialOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pt-2">
              <div className="space-y-2">
                {["Cotton", "Silk", "Denim", "Lace", "Viscose"].map((mat) => (
                  <label key={mat} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${activeMaterial === mat ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 group-hover:border-zinc-500'}`}>
                      {activeMaterial === mat && <FiCheck size={10} className="text-white" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={activeMaterial === mat}
                      onChange={() => setActiveMaterial(activeMaterial === mat ? null : mat)} 
                    />
                    <span className={`text-sm font-sans ${activeMaterial === mat ? "text-zinc-900 font-medium" : "text-zinc-600 group-hover:text-zinc-900"}`}>
                      {mat}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 w-full">
      
      {/* MOBILE FILTER OVERLAY */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[85vw] max-w-[320px] bg-white shadow-2xl z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6">
                <div className="flex justify-end mb-4">
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2 text-zinc-500 hover:text-black">
                    <FiX size={20} />
                  </button>
                </div>
                {filterContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden lg:block lg:col-span-1 bg-zinc-50 border border-zinc-100 rounded-2xl p-6 h-fit shadow-xs">
        {filterContent}
      </aside>

      {/* RIGHT CONTENT: PRODUCT GRID */}
      <div className="lg:col-span-3 flex flex-col gap-6 w-full">
        {/* Toolbar */}
        <div className="flex justify-between items-center py-4 border-b border-zinc-100 relative z-30 mb-2 gap-2">
          
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button 
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 border border-zinc-200 rounded-lg text-xs font-bold tracking-widest font-sans uppercase text-zinc-900 bg-white hover:bg-zinc-50"
            >
              <FiFilter size={14} />
              Filter
            </button>
            <div className="text-sm font-sans text-zinc-500 hidden sm:block">
              Showing <span className="font-semibold text-zinc-900">{filteredVariants.length}</span> results
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-sans text-zinc-500">
            <span className="hidden sm:inline">Sort by:</span>
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border border-zinc-200 rounded-lg bg-white min-w-32 sm:min-w-48 justify-between text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300 shadow-xs"
              >
                <span className="text-[11px] sm:text-xs">
                  {sortBy === "low-to-high" ? "Price: Low to High" : sortBy === "high-to-low" ? "Price: High to Low" : sortBy === "bestseller" ? "Bestseller" : "New Arrivals"}
                </span>
                <FiChevronDown size={12} className={`sm:size-3.5 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      {(
                        [
                          { value: "low-to-high", label: "Price: Low to High" },
                          { value: "high-to-low", label: "Price: High to Low" },
                          { value: "bestseller", label: "Bestseller" },
                          { value: "new-arrivals", label: "New Arrivals" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-sans transition-colors flex justify-between items-center ${
                            sortBy === opt.value
                              ? "bg-zinc-50 font-bold text-zinc-900"
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.value && <FiCheck size={12} className="text-zinc-900" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Mobile results count */}
        <div className="text-sm font-sans text-zinc-500 sm:hidden">
          Showing <span className="font-semibold text-zinc-900">{filteredVariants.length}</span> results
        </div>

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-square w-full bg-[#f3f3f3] rounded-sm animate-pulse" />
                <div className="flex justify-between items-center px-1">
                  <div className="flex flex-col gap-2">
                    <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
                  </div>
                  <div className="w-9 h-9 rounded-full bg-zinc-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredVariants.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 flex flex-col items-center justify-center">
            <h3 className="font-serif text-xl text-zinc-900 mb-2">No styles found</h3>
            <p className="text-xs md:text-sm text-zinc-500 mb-6 font-sans">
              No products match your active filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-zinc-900 hover:bg-black text-white text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase rounded-lg transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${sortBy}-${filteredVariants.length}`}
          >
            {filteredVariants.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cardVariants={cardVariants}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
