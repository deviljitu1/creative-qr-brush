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
  const [fgColor, setFgColor] = useState("#8b5cf6");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotType, setDotType] = useState<"rounded" | "dots" | "classy" | "square">("rounded");
  const [cornerType, setCornerType] = useState<"square" | "dot" | "extra-rounded">("extra-rounded");
  const [logoImage, setLogoImage] = useState<string>("");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState(300);
  
  const qrCode = useRef<QRCodeStyling | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
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
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 5,
      },
      dotsOptions: {
        color: fgColor,
        type: dotType,
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerType,
      },
      cornersDotOptions: {
        color: fgColor,
        type: "dot",
      },
      image: logoImage || undefined,
    });

    if (canvasRef.current) {
      canvasRef.current.innerHTML = "";
      qrCode.current.append(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: text,
        width: size,
        height: size,
        qrOptions: {
          errorCorrectionLevel: errorLevel,
        },
        dotsOptions: {
          color: fgColor,
          type: dotType,
        },
        backgroundOptions: {
          color: bgColor,
        },
        cornersSquareOptions: {
          color: fgColor,
          type: cornerType,
        },
        cornersDotOptions: {
          color: fgColor,
          type: "dot",
        },
        image: logoImage || undefined,
      });
    }
  }, [text, fgColor, bgColor, dotType, cornerType, logoImage, errorLevel, size]);

  const handleDownload = () => {
    if (qrCode.current) {
      qrCode.current.download({ name: "artistic-qr-code", extension: "png" });
      toast.success("QR Code downloaded!");
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fgColor">Foreground Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            </div>

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
              <Label htmlFor="size">Size: {size}px</Label>
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
              <Label htmlFor="logo">Logo Image (Optional)</Label>
              <div className="mt-1.5">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>
              {logoImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogoImage("")}
                  className="mt-2"
                >
                  Remove Logo
                </Button>
              )}
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
              className="flex items-center justify-center bg-muted rounded-lg p-8 min-h-[300px]"
              style={{ 
                boxShadow: "var(--shadow-elegant)",
                background: "var(--gradient-subtle)"
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
