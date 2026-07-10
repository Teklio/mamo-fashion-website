import { CustomerProduct } from "../types/product.type";

export const mockProducts: CustomerProduct[] = [
  {
    id: "var-1",
    productId: "prod-1",
    title: "Floral Summer Dress",
    price: "45.00",
    primaryImageUrl: "/images/dress_floral_1783421100750.png",
    secondaryImageUrl: "/images/dress_floral_1783421100750.png",
    colorName: "Floral White",
    colorCode: "#ffffff",
    sizes: [
      { id: "sz-1-s", size: "S", stock: 10 },
      { id: "sz-1-m", size: "M", stock: 15 },
    ],
  },
  {
    id: "var-2",
    productId: "prod-2",
    title: "Elegant Pink Party Dress",
    price: "85.00",
    primaryImageUrl: "/images/dress_party_1783421121892.png",
    secondaryImageUrl: "/images/dress_party_1783421121892.png",
    colorName: "Soft Pink",
    colorCode: "#ffb6c1",
    sizes: [
      { id: "sz-2-m", size: "M", stock: 5 },
      { id: "sz-2-l", size: "L", stock: 8 },
    ],
  },
  {
    id: "var-3",
    productId: "prod-3",
    title: "Casual Denim Style Dress",
    price: "35.00",
    primaryImageUrl: "/images/dress_casual_1783421150182.png",
    secondaryImageUrl: "/images/dress_casual_1783421150182.png",
    colorName: "Denim Blue",
    colorCode: "#3b5998",
    sizes: [
      { id: "sz-3-s", size: "S", stock: 20 },
      { id: "sz-3-m", size: "M", stock: 12 },
    ],
  },
  {
    id: "var-4",
    productId: "prod-4",
    title: "Formal White Lace Dress",
    price: "95.00",
    primaryImageUrl: "/images/dress_lace_1783421167972.png",
    secondaryImageUrl: "/images/dress_lace_1783421167972.png",
    colorName: "Pure White",
    colorCode: "#f8f8f8",
    sizes: [
      { id: "sz-4-s", size: "S", stock: 4 },
      { id: "sz-4-m", size: "M", stock: 10 },
    ],
  },
];
