import chocolateImg from "./assets/chocolate.png";
import strawberryImg from "./assets/strawberry.png";
import mintImg from "./assets/mint.png";
import vanillaImg from "./assets/vanilla.png";

export type Theme = "chocolate" | "strawberry" | "mint" | "vanilla";

export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  images: string[];
  color: string;
  theme: Theme;
}

export type AddToCartOptions = {
  quantity?: number;
  redirectToCheckout?: boolean;
};

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface ThemeConfig {
  bg: string;
  wave: string;
  button: string;
  title: string;
  description: string;
  pintColor: string;
  pintImage: string;
  scoopImage: string;
  calories: number;
  fullImage: string;
}

export const THEMES: Record<Theme, ThemeConfig> = {
  chocolate: {
    bg: "#B37256",
    wave: "#FFF9E7",
    button: "#3D2B1F",
    title: "Cookies and Kräm",
    description:
      "A rich, velvety chocolate base swirled with crunchy cookie chunks. Pure bliss in every scoop.",
    pintColor: "#B37256",
    pintImage:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
    scoopImage:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    calories: 280,
    fullImage: chocolateImg,
  },
  strawberry: {
    bg: "#E57373",
    wave: "#FFF1F1",
    button: "#C62828",
    title: "Strawberry Swirl",
    description:
      "Freshly picked strawberries blended into a creamy dream. Sweet, tart, and totally refreshing.",
    pintColor: "#E57373",
    pintImage:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=800&q=80",
    scoopImage:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80",
    calories: 260,
    fullImage: strawberryImg,
  },
  mint: {
    bg: "#4DB6AC",
    wave: "#E0F2F1",
    button: "#00695C",
    title: "Mint Chip",
    description:
      "Cool peppermint paired with dark chocolate chips. The ultimate refreshing treat.",
    pintColor: "#4DB6AC",
    pintImage:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=800&q=80",
    scoopImage:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80",
    calories: 220,
    fullImage: mintImg,
  },
  vanilla: {
    bg: "#FDF5E6",
    wave: "#FFF9E7",
    button: "#D2B48C",
    title: "Vanilla Bean",
    description:
      "Smooth, creamy vanilla bean harvested from the finest sources. A timeless classic perfected.",
    pintColor: "#FDF5E6",
    pintImage:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80",
    scoopImage:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80",
    calories: 240,
    fullImage: vanillaImg,
  },
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Cookies and Kräm",
    price: "$12.00",
    description: "Swedish style light ice cream",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    ],
    color: "#B37256",
    theme: "chocolate",
  },
  {
    id: "3",
    name: "Strawberry Swirl",
    price: "$10.00",
    description: "Swedish style light ice cream",
    image:
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80",
    ],
    color: "#E57373",
    theme: "strawberry",
  },
  {
    id: "4",
    name: "Mint Chip",
    price: "$14.00",
    description: "Swedish style light ice cream",
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80",
    ],
    color: "#4DB6AC",
    theme: "mint",
  },
  {
    id: "2",
    name: "Vanilla Bean",
    price: "$11.00",
    description: "Swedish style light ice cream",
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80",
    ],
    color: "#FDF5E6",
    theme: "vanilla",
  },
];
