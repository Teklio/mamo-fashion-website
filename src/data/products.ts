export interface Product {
  id: string;
  name: string;
  brand: string;
  priceText: string;
  priceVal: number;
  image: string;
  hoverImage?: string;
}

export const products: Product[] = [
  {
    id: "rae-01",
    name: "Rae Collections Blue & Yellow Sandals",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/1.png",
  },
  {
    id: "rae-02",
    name: "Rae Collections Maroon Sandals",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/2.png",
  },
  {
    id: "rae-03",
    name: "Rae Collections Green & Red Sandals",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/3.png",
  },
  {
    id: "rae-04",
    name: "Rae Collections Blue & Yellow Sandals Extra",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/1.png",
  },
  {
    id: "rae-05",
    name: "Rae Collections Maroon Sandals Extra",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/2.png",
  },
  {
    id: "rae-06",
    name: "Rae Collections Green & Red Sandals Extra",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/3.png",
  },
  {
    id: "rae-07",
    name: "Rae Collections Blue & Yellow Sandals V3",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/1.png",
  },
  {
    id: "rae-08",
    name: "Rae Collections Maroon Sandals V3",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/2.png",
  },
  {
    id: "rae-09",
    name: "Rae Collections Green & Red Sandals V3",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/3.png",
  },
];
