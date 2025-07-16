import SkincareWidget from "@/components/skincare-widget/SkincareWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Minimalist Brand Name Top Left */}
      <div className="fixed top-4 left-4 z-50 font-bold text-xl text-primary tracking-wide select-none">
        Minimalist
      </div>
      {/* Demo Page Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">
              <span className="text-3xl md:text-5xl font-bold text-foreground">Discover Your Perfect</span>
              <span className="block bg-gradient-primary bg-clip-text text-transparent text-3xl md:text-5xl">Skincare Routine</span>
            </h1>
            {/* --- Video below the heading --- */}
            <div className="flex justify-center w-full">
              <video
                src="/Minimalist-Cleanser-good_bad.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full max-w-xs md:max-w-md rounded-xl shadow-lg my-8"
                style={{ objectFit: "cover" }}
              />
            </div>
            {/* --- End video block --- */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Skincare companion app that analyzes your skin and creates 
              personalized product recommendations just for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">❓</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Quick Quiz</h3>
              <p className="text-muted-foreground text-sm">
                Answer a few questions about your lifestyle and concerns
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Get Results</h3>
              <p className="text-muted-foreground text-sm">
                Receive personalized product recommendations
              </p>
            </div>
          </div>
          
          <div className="mt-16 p-8 bg-card rounded-2xl shadow-card">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ready to transform your skincare routine?
            </h2>
            <p className="text-muted-foreground mb-6">
              Click the widget in the bottom right to get started!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Look for the</span>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-xs">✨</span>
              </div>
              <span>button</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skincare Widget */}
      <SkincareWidget />
    </div>
  );
};

export default Index;
