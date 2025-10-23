import { QRGenerator } from "@/components/QRGenerator";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto py-12">
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Design</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
            Artistic QR Code Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Create stunning, customizable QR codes with artistic patterns, colors, and embedded logos
          </p>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <QRGenerator />
        </main>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Built with ❤️ using React and QR Code Styling</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
