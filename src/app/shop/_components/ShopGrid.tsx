"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiChevronDown, FiCheck, FiFilter, FiX, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts } from "@/services/product.service";
import {
  useMainCategories,
  useSubCategories,
  useMaterials,
  useColors,
  useSizes,
} from "@/services/catalog.service";
import { getMultiColorBackground } from "@/types/product.type";
import ProductCard from "@/components/ProductCard";

type SortBy = "newest" | "price_asc" | "price_desc" | "bestseller";

function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

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
  const [sortBy, setSortBy] = useState<SortBy>("newest");

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // `expandedMainCategoryId` is purely which accordion panel is open — it no
  // longer implies or resets which subcategories are selected, since
  // subcategories are now a multi-select filter that can span main categories.
  const [expandedMainCategoryId, setExpandedMainCategoryId] = useState<string | null | undefined>(undefined);
  const [activeSubcategoryIds, setActiveSubcategoryIds] = useState<string[]>([]);
  const [activeSizeIds, setActiveSizeIds] = useState<string[]>([]);
  const [activeColorIds, setActiveColorIds] = useState<string[]>([]);
  const [activeMaterialIds, setActiveMaterialIds] = useState<string[]>([]);

  const [appliedMin, setAppliedMin] = useState<number | undefined>(undefined);
  const [appliedMax, setAppliedMax] = useState<number | undefined>(undefined);

  // Catalog metadata for the filter UI
  const { data: mainCategories = [] } = useMainCategories();

  // Resolve an initial ?category= name to a main category id (no effect needed).
  const initialMainCategoryId = useMemo(() => {
    if (!initialCategory || !mainCategories.length) return null;
    const match = mainCategories.find(
      (c) => c.name.toLowerCase() === initialCategory.toLowerCase(),
    );
    return match?.id ?? null;
  }, [initialCategory, mainCategories]);

  // Effective expanded main category: explicit choice wins, else the URL default.
  const activeMainCategory =
    expandedMainCategoryId === undefined ? initialMainCategoryId : expandedMainCategoryId;

  const { data: subCategories = [] } = useSubCategories(activeMainCategory ?? undefined);
  const { data: materials = [] } = useMaterials();
  const { data: colors = [] } = useColors();
  const { data: sizes = [] } = useSizes();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading } = useGetProducts({
    limit: 100,
    minPrice: appliedMin,
    maxPrice: appliedMax,
    sortBy,
    search: debouncedSearch || undefined,
    subCategoryId: activeSubcategoryIds.length ? activeSubcategoryIds : undefined,
    materialId: activeMaterialIds.length ? activeMaterialIds : undefined,
    colorId: activeColorIds.length ? activeColorIds : undefined,
    sizeId: activeSizeIds.length ? activeSizeIds : undefined,
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
    setExpandedMainCategoryId(null);
    setActiveSubcategoryIds([]);
    setActiveSizeIds([]);
    setActiveColorIds([]);
    setActiveMaterialIds([]);
    setSearchInput("");
    setDebouncedSearch("");
  };

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
              {mainCategories.map((main) => (
                <div key={main.id} className="space-y-1">
                  <button
                    onClick={() =>
                      setExpandedMainCategoryId(activeMainCategory === main.id ? null : main.id)
                    }
                    className={`flex items-center justify-between w-full text-sm font-sans py-1.5 transition-colors ${activeMainCategory === main.id ? "font-bold text-zinc-900" : "text-zinc-600 hover:text-zinc-900"}`}
                  >
                    {main.name}
                    <FiChevronDown size={14} className={`transition-transform ${activeMainCategory === main.id ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {activeMainCategory === main.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 space-y-1.5"
                      >
                        {subCategories.map((sub) => (
                          <label key={sub.id} className="flex items-center space-x-3 cursor-pointer group py-0.5">
                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors shrink-0 ${activeSubcategoryIds.includes(sub.id) ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 group-hover:border-zinc-500'}`}>
                              {activeSubcategoryIds.includes(sub.id) && <FiCheck size={10} className="text-white" />}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={activeSubcategoryIds.includes(sub.id)}
                              onChange={() => setActiveSubcategoryIds((prev) => toggleId(prev, sub.id))}
                            />
                            <span className={`text-xs font-sans ${activeSubcategoryIds.includes(sub.id) ? "text-zinc-900 font-semibold" : "text-zinc-500 group-hover:text-zinc-800"}`}>
                              {sub.name}
                            </span>
                          </label>
                        ))}
                        {subCategories.length === 0 && (
                          <p className="text-[11px] text-zinc-400 font-sans py-1.5">No subcategories</p>
                        )}
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
                {sizes.map((size) => (
                  <label key={size.id} className="cursor-pointer group">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={activeSizeIds.includes(size.id)}
                      onChange={() => setActiveSizeIds((prev) => toggleId(prev, size.id))}
                    />
                    <div className={`min-w-10 h-10 px-2 rounded-sm border flex items-center justify-center transition-all ${activeSizeIds.includes(size.id) ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-500'}`}>
                      <span className="text-xs font-sans font-medium">{size.name}</span>
                    </div>
                  </label>
                ))}
                {sizes.length === 0 && (
                  <p className="text-[11px] text-zinc-400 font-sans">No sizes</p>
                )}
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
                {colors.map((color) => {
                  const isSelected = activeColorIds.includes(color.id);
                  return (
                    <button
                      key={color.id}
                      onClick={() => setActiveColorIds((prev) => toggleId(prev, color.id))}
                      className="flex items-center space-x-3 group text-left w-fit"
                    >
                      {/* Outer ring shows selection; independent of the swatch's own
                          colors so it always reads clearly. */}
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-zinc-900' : 'border-transparent group-hover:border-zinc-300'}`}
                      >
                        <div
                          className="w-6 h-6 rounded-full shadow-inner"
                          style={{
                            background: getMultiColorBackground(color.colorCodes),
                            border: isSelected ? "none" : "1px solid #e4e4e7",
                          }}
                        />
                      </div>
                      <span className={`text-sm font-sans transition-colors ${isSelected ? "text-zinc-900 font-bold" : "text-zinc-600 group-hover:text-zinc-900"}`}>
                        {color.name}
                      </span>
                    </button>
                  );
                })}
                {colors.length === 0 && (
                  <p className="text-[11px] text-zinc-400 font-sans">No colors</p>
                )}
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
                {materials.map((mat) => (
                  <label key={mat.id} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${activeMaterialIds.includes(mat.id) ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 group-hover:border-zinc-500'}`}>
                      {activeMaterialIds.includes(mat.id) && <FiCheck size={10} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={activeMaterialIds.includes(mat.id)}
                      onChange={() => setActiveMaterialIds((prev) => toggleId(prev, mat.id))}
                    />
                    <span className={`text-sm font-sans ${activeMaterialIds.includes(mat.id) ? "text-zinc-900 font-medium" : "text-zinc-600 group-hover:text-zinc-900"}`}>
                      {mat.name}
                    </span>
                  </label>
                ))}
                {materials.length === 0 && (
                  <p className="text-[11px] text-zinc-400 font-sans">No materials</p>
                )}
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
        {/* Search */}
        <div className="relative">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products, categories, materials, colors…"
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900 shadow-xs"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900"
              aria-label="Clear search"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

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
              Showing <span className="font-semibold text-zinc-900">{variants.length}</span> results
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
                  {sortBy === "price_asc" ? "Price: Low to High" : sortBy === "price_desc" ? "Price: High to Low" : sortBy === "bestseller" ? "Bestseller" : "New Arrivals"}
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
                          { value: "newest", label: "New Arrivals" },
                          { value: "price_asc", label: "Price: Low to High" },
                          { value: "price_desc", label: "Price: High to Low" },
                          { value: "bestseller", label: "Bestseller" },
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
          Showing <span className="font-semibold text-zinc-900">{variants.length}</span> results
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
        ) : variants.length === 0 ? (
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
            key={`${sortBy}-${variants.length}`}
          >
            {variants.map((product) => (
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
