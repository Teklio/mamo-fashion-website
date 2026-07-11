import { CustomerProduct } from "../types/product.type";

const womenSubcategories = [
  "prayer set", "shawl", "cotton knistic", "co-ord set", 
  "3 piece set", "2 piece set", "Kuftan Nighties", 
  "korean Nighties", "Cotton Nighties", "frock Nighties"
];

const kidsSubcategories = [
  "Daily wear", "dusty wear", "korean nighties", "prayer dress"
];

const baseWomenImages = [
  "/images/womens_kuftan_1783679518759.png",
  "/images/womens_prayer_set_1783679529206.png",
  "/images/womens_coord_set_1783679991630.png"
];

const baseKidsImages = [
  "/images/kids_dusty_wear_1783679541973.png",
  "/images/kids_daily_wear_1783680006898.png",
  "/images/kids_korean_nightie_1783680016190.png"
];

const colors = [
  { name: "Navy", code: "#000080" },
  { name: "White", code: "#ffffff" },
  { name: "Pink", code: "#ffb6c1" },
  { name: "Rose", code: "#dcae96" },
  { name: "Blue", code: "#3b5998" }
];

const materials = ["Cotton", "Silk", "Denim", "Lace", "Viscose"];

export const mockProducts: CustomerProduct[] = [];

let idCounter = 1;

const womenImageMap: Record<string, string> = {
  "prayer set": "/images/womens_prayer_set_1783762081344.png",
  "shawl": "/images/womens_shawl_1783762093173.png",
  "co-ord set": "/images/womens_coord_set_1783762105299.png",
  "Kuftan Nighties": "/images/womens_kuftan_1783762115897.png",
  "2 piece set": "/images/womens_coord_set_1783679991630.png",
  "3 piece set": "/images/womens_prayer_set_1783679529206.png",
};

const kidsImageMap: Record<string, string> = {
  "Daily wear": "/images/kids_daily_wear_1783762129724.png",
  "korean nighties": "/images/kids_korean_nightie_1783762142503.png",
  "dusty wear": "/images/kids_dusty_wear_1783679541973.png",
  "prayer dress": "/images/kids_daily_wear_1783680006898.png",
};

// Generate Women Products
womenSubcategories.forEach((subCat, index) => {
  for (let i = 0; i < 3; i++) {
    const color = colors[(index + i) % colors.length];
    const material = materials[(index + i) % materials.length];
    const title = `Women's ${subCat} ${i + 1}`;
    
    // Use mapped generated image if available, otherwise dynamic placeholder
    const imgUrl = womenImageMap[subCat] 
      ? womenImageMap[subCat]
      : `https://placehold.co/600x800/f3f3f3/333333?text=${encodeURIComponent(title + "\\n" + subCat)}`;

    mockProducts.push({
      id: `var-${idCounter}`,
      productId: `prod-${idCounter}`,
      title,
      price: (45 + (idCounter % 5) * 10).toFixed(2),
      primaryImageUrl: imgUrl,
      secondaryImageUrl: imgUrl,
      colorName: color.name,
      colorCode: color.code,
      mainCategory: "Women",
      subCategory: subCat,
      material: material,
      sizes: [
        { id: `sz-${idCounter}-s`, size: "S", stock: 10 },
        { id: `sz-${idCounter}-m`, size: "M", stock: 5 },
        { id: `sz-${idCounter}-l`, size: "L", stock: 0 },
        { id: `sz-${idCounter}-xl`, size: "XL", stock: 2 },
      ],
    });
    idCounter++;
  }
});

// Generate Kids Products
kidsSubcategories.forEach((subCat, index) => {
  for (let i = 0; i < 3; i++) {
    const color = colors[(index + i) % colors.length];
    const material = materials[(index + i) % materials.length];
    const title = `Kids' ${subCat} ${i + 1}`;
    
    const imgUrl = kidsImageMap[subCat]
      ? kidsImageMap[subCat]
      : `https://placehold.co/600x800/f3f3f3/333333?text=${encodeURIComponent(title + "\\n" + subCat)}`;

    mockProducts.push({
      id: `var-${idCounter}`,
      productId: `prod-${idCounter}`,
      title,
      price: (25 + (idCounter % 3) * 5).toFixed(2),
      primaryImageUrl: imgUrl,
      secondaryImageUrl: imgUrl,
      colorName: color.name,
      colorCode: color.code,
      mainCategory: "Kids",
      subCategory: subCat,
      material: material,
      sizes: [
        { id: `sz-${idCounter}-s`, size: "S", stock: 15 },
        { id: `sz-${idCounter}-m`, size: "M", stock: 20 },
      ],
    });
    idCounter++;
  }
});
