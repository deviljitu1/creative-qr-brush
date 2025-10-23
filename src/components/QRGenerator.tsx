import { useState, useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Copy, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const QRGenerator = () => {
  const [text, setText] = useState("https://lovable.dev");
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [dotType, setDotType] = useState<"rounded" | "dots" | "classy" | "square">("rounded");
  const [cornerType, setCornerType] = useState<"square" | "dot" | "extra-rounded">("extra-rounded");
  const [logoImage, setLogoImage] = useState<string>("");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState(300);
  const [qrOpacity, setQrOpacity] = useState(0.8);
  
  const qrCode = useRef<QRCodeStyling | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config: any = {
      width: size,
      height: size,
      data: text,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: errorLevel,
      },
      imageOptions: {
        hideBackgroundDots: false,
        imageSize: 0.3,
        margin: 8,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: dotType,
      },
      cornersSquareOptions: {
        type: cornerType,
      },
      cornersDotOptions: {
        type: "dot",
      },
      image: logoImage || undefined,
    };

    if (backgroundImage) {
      config.backgroundOptions = {
        gradient: {
          type: "radial",
          rotation: 0,
          colorStops: [
            { offset: 0, color: "rgba(255, 255, 255, 0)" },
            { offset: 1, color: "rgba(255, 255, 255, 0)" },
          ],
        },
      };
      config.dotsOptions.gradient = {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: `rgba(0, 0, 0, ${qrOpacity})` },
          { offset: 1, color: `rgba(0, 0, 0, ${qrOpacity})` },
        ],
      };
      config.cornersSquareOptions.gradient = {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: `rgba(0, 0, 0, ${qrOpacity})` },
          { offset: 1, color: `rgba(0, 0, 0, ${qrOpacity})` },
        ],
      };
      config.cornersDotOptions.gradient = {
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: `rgba(0, 0, 0, ${qrOpacity})` },
          { offset: 1, color: `rgba(0, 0, 0, ${qrOpacity})` },
        ],
      };
    } else {
      config.backgroundOptions = {
        color: "#ffffff",
      };
      config.dotsOptions.color = "#8b5cf6";
      config.cornersSquareOptions.color = "#8b5cf6";
      config.cornersDotOptions.color = "#8b5cf6";
    }

    qrCode.current = new QRCodeStyling(config);

    if (canvasRef.current) {
      canvasRef.current.innerHTML = "";
      qrCode.current.append(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      const updateConfig: any = {
        data: text,
        width: size,
        height: size,
        qrOptions: {
          errorCorrectionLevel: errorLevel,
        },
        dotsOptions: {
          type: dotType,
        },
        cornersSquareOptions: {
          type: cornerType,
        },
        cornersDotOptions: {
          type: "dot",
        },
        image: logoImage || undefined,
      };

      if (backgroundImage) {
        updateConfig.backgroundOptions = {
          gradient: {
            type: "radial",
            rotation: 0,
            colorStops: [
              { offset: 0, color: "rgba(255, 255, 255, 0)" },
              { offset: 1, color: "rgba(255, 255, 255, 0)" },
            ],
          },
        };
        updateConfig.dotsOptions.gradient = {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: `rgba(0, 0, 0, ${qrOpacity})` },
            { offset: 1, color: `rgba(0, 0, 0, ${qrOpacity})` },
          ],
        };
        updateConfig.cornersSquareOptions.gradient = {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: `rgba(0, 0, 0, ${qrOpacity})` },
            { offset: 1, color: `rgba(0, 0, 0, ${qrOpacity})` },
          ],
        };
        updateConfig.cornersDotOptions.gradient = {
          type: "linear",
          rotation: 0,
          colorStops: [
            { offset: 0, color: `rgba(0, 0, 0, ${qrOpacity})` },
            { offset: 1, color: `rgba(0, 0, 0, ${qrOpacity})` },
          ],
        };
      } else {
        updateConfig.backgroundOptions = {
          color: "#ffffff",
        };
        updateConfig.dotsOptions.color = "#8b5cf6";
        updateConfig.cornersSquareOptions.color = "#8b5cf6";
        updateConfig.cornersDotOptions.color = "#8b5cf6";
      }

      qrCode.current.update(updateConfig);
    }
  }, [text, dotType, cornerType, logoImage, errorLevel, size, backgroundImage, qrOpacity]);

  const handleDownload = () => {
    if (qrCode.current) {
      // Temporarily update to 8K for download
      qrCode.current.update({
        width: 8000,
        height: 8000,
      });
      
      qrCode.current.download({ name: "artistic-qr-code-8k", extension: "png" });
      
      // Restore original size after a short delay
      setTimeout(() => {
        if (qrCode.current) {
          qrCode.current.update({
            width: size,
            height: size,
          });
        }
      }, 500);
      
      toast.success("8K QR Code downloaded!");
    }
  };

  const handleCopy = async () => {
    if (qrCode.current) {
      const data = await qrCode.current.getRawData("png");
      if (data && data instanceof Blob) {
        const item = new ClipboardItem({ "image/png": data });
        await navigator.clipboard.write([item]);
        toast.success("QR Code copied to clipboard!");
      }
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
        toast.success("Background image uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target?.result as string);
        toast.success("Logo uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 w-full max-w-7xl mx-auto p-6">
      <Card className="p-6 space-y-6 bg-card border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Customize Your QR
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Content (URL or Text)</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter URL or text"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="backgroundImage">Background Image (Optional)</Label>
              <div className="mt-1.5 space-y-2">
                <Input
                  id="backgroundImage"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="cursor-pointer"
                />
                {backgroundImage && (
                  <div className="flex gap-2 items-center">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={backgroundImage} alt="Background preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setBackgroundImage("")}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {backgroundImage && (
              <div>
                <Label htmlFor="qrOpacity">QR Code Opacity: {Math.round(qrOpacity * 100)}%</Label>
                <Slider
                  id="qrOpacity"
                  value={[qrOpacity]}
                  onValueChange={(value) => setQrOpacity(value[0])}
                  min={0.3}
                  max={1}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            )}

            <div>
              <Label htmlFor="dotType">Dot Style</Label>
              <Select value={dotType} onValueChange={(value: any) => setDotType(value)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cornerType">Corner Style</Label>
              <Select value={cornerType} onValueChange={(value: any) => setCornerType(value)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="errorLevel">Error Correction</Label>
              <Select value={errorLevel} onValueChange={(value: any) => setErrorLevel(value)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="size">Preview Size: {size}px (Downloads at 8K)</Label>
              <Slider
                id="size"
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                min={200}
                max={500}
                step={50}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="logo">Center Logo (Optional)</Label>
              <div className="mt-1.5 space-y-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoImageUpload}
                  className="cursor-pointer"
                />
                {logoImage && (
                  <div className="flex gap-2 items-center">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                      <img src={logoImage} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLogoImage("")}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-8 bg-card border-border">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Preview</h3>
            <div
              ref={canvasRef}
              className="flex items-center justify-center rounded-lg p-8 min-h-[300px] relative overflow-hidden"
              style={{ 
                boxShadow: "var(--shadow-elegant)",
                background: backgroundImage ? `url(${backgroundImage})` : "var(--gradient-subtle)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleDownload} className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          <Button onClick={handleCopy} variant="outline" className="flex-1">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
