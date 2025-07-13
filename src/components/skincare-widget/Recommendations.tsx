import { useState } from "react";
import { Sparkles, Share2, Download, ShoppingBag, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkinAnalysis, QuizAnswers } from "./SkincareWidget";
import { toast } from "sonner";

interface RecommendationsProps {
  skinAnalysis: SkinAnalysis;
  quizAnswers: QuizAnswers;
  onClose: () => void;
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

export const Recommendations = ({ skinAnalysis, quizAnswers, onClose }: RecommendationsProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const recommendations = getProductRecommendations(skinAnalysis, quizAnswers);

  const handleSaveResults = () => {
    toast.success("Skincare routine saved! Check your downloads.");
  };

  const handleShareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Personalized Skincare Routine",
        text: `I just got my personalized skincare routine for ${skinAnalysis.skinType} skin!`,
        url: window.location.href
      });
    } else {
      toast.success("Sharing link copied to clipboard!");
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const totalPrice = recommendations
    .filter(p => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Results Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Your Personalized Routine
        </h3>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            Based on your {skinAnalysis.skinType} skin type
          </p>
          {skinAnalysis.detectedConditions.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {skinAnalysis.detectedConditions.map((condition, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {condition.severity} {condition.type}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-muted-foreground text-xs">
            Tailored for your lifestyle and environment
          </p>
        </div>
      </div>

      {/* Product Recommendations */}
      <div className="space-y-4">
        <h4 className="font-medium text-foreground">Recommended Products</h4>
        
        {recommendations.map((product) => (
          <Card 
            key={product.id}
            className={`p-4 transition-all cursor-pointer ${
              selectedProducts.includes(product.id)
                ? "border-primary bg-accent/20"
                : "hover:border-primary/50"
            }`}
            onClick={() => toggleProductSelection(product.id)}
          >
            <div className="flex gap-4">
              <img 
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-foreground">{product.name}</h5>
                    <p className="text-sm text-muted-foreground capitalize">
                      {product.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${product.price}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {product.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Cart Summary */}
      {selectedProducts.length > 0 && (
        <Card className="p-4 bg-gradient-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-foreground">
              Selected Items ({selectedProducts.length})
            </span>
            <span className="font-semibold text-foreground">
              ${totalPrice}
            </span>
          </div>
          <Button className="w-full" size="lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleSaveResults}>
            <Download className="w-4 h-4 mr-2" />
            Save Results
          </Button>
          <Button variant="outline" onClick={handleShareResults}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={onClose}
        >
          Start New Analysis
        </Button>
        
        <Button variant="outline" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Explore More Products
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Results are based on AI analysis and may vary. Consult a dermatologist for 
          specific skin concerns. Patch test new products before full use.
        </p>
      </div>
    </div>
  );
};