import { useState } from "react";
import { Sparkles, Share2, Download, ShoppingBag, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkinAnalysis, QuizAnswers } from "./SkincareWidget";
import { toast } from "sonner";

interface RecommendationsProps {
  quizAnswers: any;
  onClose: () => void;
  onPackageSelect?: (packageId: string) => void;
}

interface Product {
  id: string;
  name: string;
  type: "cleanser" | "moisturizer" | "sunscreen" | "serum" | "treatment";
  price: number;
  rating: number;
  benefits: string[];
  image: string;
  description: string;
}

// Enhanced product recommendation engine
const getProductRecommendations = (skinAnalysis: SkinAnalysis, quizAnswers: QuizAnswers): Product[] => {
  const products: Record<string, Product[]> = {
    oily: [
      {
        id: "1",
        name: "Gentle Foaming Cleanser",
        type: "cleanser",
        price: 24,
        rating: 4.6,
        benefits: ["Controls oil", "Unclogs pores", "Gentle formula"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        description: "Oil-control cleanser with salicylic acid"
      },
      {
        id: "2", 
        name: "Oil-Free Moisturizer",
        type: "moisturizer",
        price: 32,
        rating: 4.5,
        benefits: ["Non-comedogenic", "Lightweight", "Hydrating"],
        image: "https://images.unsplash.com/photo-1570554886111-e80fcac6c67e?w=300&h=300&fit=crop",
        description: "Lightweight moisturizer for oily skin"
      },
      {
        id: "3",
        name: "Broad Spectrum SPF 30",
        type: "sunscreen", 
        price: 28,
        rating: 4.7,
        benefits: ["Non-greasy", "UV protection", "Matte finish"],
        image: "https://images.unsplash.com/photo-1556228852-80175d0b0a97?w=300&h=300&fit=crop",
        description: "Matte sunscreen for oily skin"
      }
    ],
    dry: [
      {
        id: "4",
        name: "Hydrating Cream Cleanser",
        type: "cleanser",
        price: 26,
        rating: 4.5,
        benefits: ["Moisturizing", "Gentle", "Non-stripping"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        description: "Creamy cleanser that won't dry out skin"
      },
      {
        id: "5",
        name: "Rich Repair Moisturizer", 
        type: "moisturizer",
        price: 38,
        rating: 4.8,
        benefits: ["Deep hydration", "Barrier repair", "24h moisture"],
        image: "https://images.unsplash.com/photo-1570554886111-e80fcac6c67e?w=300&h=300&fit=crop",
        description: "Intensive moisturizer for dry skin"
      },
      {
        id: "6",
        name: "Hydrating SPF 30",
        type: "sunscreen",
        price: 30,
        rating: 4.6,
        benefits: ["Moisturizing", "UV protection", "Skin-loving ingredients"],
        image: "https://images.unsplash.com/photo-1556228852-80175d0b0a97?w=300&h=300&fit=crop",
        description: "Hydrating sunscreen with ceramides"
      }
    ],
    // Add more skin types...
    combination: [
      {
        id: "7",
        name: "Balancing Gel Cleanser",
        type: "cleanser",
        price: 25,
        rating: 4.4,
        benefits: ["Balances oil", "Gentle on dry areas", "pH balanced"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        description: "Perfect for combination skin types"
      },
      {
        id: "8",
        name: "Dual-Zone Moisturizer",
        type: "moisturizer", 
        price: 35,
        rating: 4.5,
        benefits: ["Balances skin", "Lightweight", "Targeted care"],
        image: "https://images.unsplash.com/photo-1570554886111-e80fcac6c67e?w=300&h=300&fit=crop",
        description: "Balanced hydration for combination skin"
      },
      {
        id: "9",
        name: "Universal SPF 30",
        type: "sunscreen",
        price: 29,
        rating: 4.6,
        benefits: ["Suitable for all areas", "Non-greasy", "Broad spectrum"],
        image: "https://images.unsplash.com/photo-1556228852-80175d0b0a97?w=300&h=300&fit=crop",
        description: "Versatile sunscreen for combination skin"
      }
    ],
    normal: [
      {
        id: "10",
        name: "Daily Gentle Cleanser",
        type: "cleanser",
        price: 22,
        rating: 4.7,
        benefits: ["Maintains balance", "Gentle formula", "Daily use"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        description: "Perfect daily cleanser for normal skin"
      },
      {
        id: "11",
        name: "Daily Moisturizer",
        type: "moisturizer",
        price: 30,
        rating: 4.6,
        benefits: ["Maintains moisture", "Lightweight", "All-day comfort"],
        image: "https://images.unsplash.com/photo-1570554886111-e80fcac6c67e?w=300&h=300&fit=crop",
        description: "Perfect balance for normal skin"
      },
      {
        id: "12",
        name: "Daily Protection SPF 30",
        type: "sunscreen",
        price: 27,
        rating: 4.7,
        benefits: ["Lightweight", "No white cast", "Daily wear"],
        image: "https://images.unsplash.com/photo-1556228852-80175d0b0a97?w=300&h=300&fit=crop",
        description: "Easy daily sun protection"
      }
    ],
    sensitive: [
      {
        id: "13",
        name: "Ultra-Gentle Cleanser",
        type: "cleanser",
        price: 28,
        rating: 4.8,
        benefits: ["Fragrance-free", "Hypoallergenic", "Soothing"],
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
        description: "Extra gentle for sensitive skin"
      },
      {
        id: "14",
        name: "Calming Moisturizer",
        type: "moisturizer",
        price: 36,
        rating: 4.7,
        benefits: ["Reduces redness", "Fragrance-free", "Barrier protection"],
        image: "https://images.unsplash.com/photo-1570554886111-e80fcac6c67e?w=300&h=300&fit=crop",
        description: "Calming care for sensitive skin"
      },
      {
        id: "15",
        name: "Mineral SPF 30",
        type: "sunscreen",
        price: 32,
        rating: 4.6,
        benefits: ["Mineral formula", "Gentle", "Sensitive skin safe"],
        image: "https://images.unsplash.com/photo-1556228852-80175d0b0a97?w=300&h=300&fit=crop",
        description: "Gentle mineral sun protection"
      }
    ]
  };

  // Enhanced recommendation logic
  let baseProducts = products[skinAnalysis.skinType] || products.normal;
  
  // Add specialized products based on detected conditions
  if (skinAnalysis.detectedConditions.length > 0) {
    skinAnalysis.detectedConditions.forEach(condition => {
      if (condition.type === "acne" && condition.severity !== "mild") {
        // Add acne-specific products
        baseProducts = [...baseProducts];
      }
    });
  }
  
  return baseProducts;
};

// Minimalist product combos by skin type
const combos = {
  oily: {
    name: "Oily Skincare Combo",
    products: [
      {
        name: "Salicylic Acid + LHA 2% Cleanser",
        desc: "Acne, Breakouts & Oiliness"
      },
      {
        name: "Salicylic Acid 2% Face Serum",
        desc: "Acne, Oily Skin, Blackheads & Irritation"
      },
      {
        name: "Vitamin B5 10% Moisturizer",
        desc: "Damaged Barrier, Oily & Dehydrated"
      }
    ]
  },
  dry: {
    name: "Dry Skincare Combo",
    products: [
      {
        name: "Oat Extract 6% Gentle Cleanser",
        desc: "Dry, Dehydrated, Sensitive Skin"
      },
      {
        name: "Vitamin B5 10% Moisturizer",
        desc: "Damaged Barrier, Oily & Dehydrated"
      },
      {
        name: "Hyaluronic + PGA 2% Face Serum",
        desc: "Dry, Dehydrated & Tightened Skin"
      }
    ]
  },
  pigmentation: {
    name: "Anti Pigmentation Combo",
    products: [
      {
        name: "Alpha Arbutin 2% Face Serum",
        desc: "Hyperpigmentation, Tanning & Sunspot"
      },
      {
        name: "Vitamin C + E + Ferulic 16% Face Serum",
        desc: "Spots, Uneven Tone & Dull Skin"
      },
      {
        name: "Tranexamic 3% Face Serum",
        desc: "Acne Scars, Melasma, PIE"
      }
    ]
  },
  dull: {
    name: "Dullness & Texture Combo",
    products: [
      {
        name: "Alpha Lipoic + Glycolic 7% Cleanser",
        desc: "Dull & Rough Skin, Uneven Tone"
      },
      {
        name: "Vitamin C 10% Face Serum",
        desc: "Dullness, Spots & Loss of Elasticity"
      },
      {
        name: "Glycolic Acid 8% Exfoliating Liquid",
        desc: "Dull Skin, Uneven Tone & Texture"
      }
    ]
  },
  aging: {
    name: "Anti Aging Combo",
    products: [
      {
        name: "Retinol 0.3% Face Serum",
        desc: "Fine Lines, Wrinkles & Loss of Elasticity"
      },
      {
        name: "Vitamin K + Retinal 1% Eye Cream",
        desc: "Dark Circles, Fine Lines & Eye Puffiness"
      },
      {
        name: "Anti Aging Skin Care Kit",
        desc: "Combo: Fine Lines & Wrinkles"
      }
    ]
  },
  sensitive: {
    name: "Sensitive Skin Combo",
    products: [
      {
        name: "Oat Extract 6% Gentle Cleanser",
        desc: "Dry, Dehydrated, Sensitive Skin"
      },
      {
        name: "Niacinamide 5% Face Serum",
        desc: "Acne Marks, Irritated & Damaged Skin"
      },
      {
        name: "Polyhydroxy Acid (PHA) 3% Face Toner",
        desc: "Enlarged Pores & Dehydrated Skin"
      }
    ]
  }
};

function getComboKeyFromQuiz(quizAnswers: any) {
  // Map quiz answers to combo key
  if (quizAnswers.concern === "acne" || quizAnswers.skinType === "oily") return "oily";
  if (quizAnswers.concern === "dark-spots" || quizAnswers.concern === "pigmentation") return "pigmentation";
  if (quizAnswers.concern === "tan" || quizAnswers.concern === "dullness") return "dull";
  if (quizAnswers.concern === "aging") return "aging";
  if (quizAnswers.skinType === "dry") return "dry";
  if (quizAnswers.skinType === "sensitive") return "sensitive";
  return "dry";
}

const comboLinks: Record<string, string> = {
  oily: "https://beminimalist.co/products/anti-acne-kit",
  dry: "https://beminimalist.co/collections/kits/products/dry-skincare-kit",
  pigmentation: "https://beminimalist.co/collections/kits/products/anti-pigmentation-kit",
  dull: "https://beminimalist.co/collections/kits/products/dry-skincare-kit",
  aging: "https://beminimalist.co/collections/kits/products/anti-aging-kit"
};

const Recommendations = ({ quizAnswers, onClose, onPackageSelect }: RecommendationsProps) => {
  const comboKey = getComboKeyFromQuiz(quizAnswers);
  const combo = combos[comboKey];
  const viewProductLink = comboLinks[comboKey];

  return (
    <div className="p-6 space-y-6">
      {/* Quiz Result */}
      <div className="mb-4 p-4 rounded-lg bg-gradient-soft border text-center">
        <div className="font-semibold text-base mb-1">Results</div>
        <div className="text-sm text-foreground capitalize">
          <span>Concern: <b>{quizAnswers.concern?.replace(/-/g, ' ')}</b></span><br/>
          <span>Skin Type: <b>{quizAnswers.skinType}</b></span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-4">Your Recommended Minimalist Combo</h2>
      <div className="space-y-4">
        {combo.products.map((product, idx) => (
          <div key={idx} className="p-4 border rounded-lg bg-card shadow-sm">
            <div className="font-semibold text-lg">{product.name}</div>
            <div className="text-sm text-muted-foreground">{product.desc}</div>
          </div>
        ))}
        {/* View Product Button after 3rd product */}
        {viewProductLink && (
          <a
            href={viewProductLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center"
          >
            <button
              className="-mt-3 mb-2 px-6 py-3 rounded-full bg-neutral-800 text-white font-semibold shadow hover:bg-neutral-900 transition"
              style={{ minWidth: 160 }}
            >
              View Product
            </button>
          </a>
        )}
      </div>
      {onPackageSelect && (
        <button
          className="w-full mt-2 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
          onClick={() => onPackageSelect(comboKey)}
        >
          Build My Routine
        </button>
      )}
      <button
        className="w-full mt-4 py-2 border rounded-lg text-primary font-medium hover:bg-primary/5"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export { Recommendations };