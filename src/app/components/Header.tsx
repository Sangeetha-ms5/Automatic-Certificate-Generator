import { Award, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface HeaderProps {
  showAdminLink?: boolean;
  onAdminClick?: () => void;
}

export function Header({ showAdminLink, onAdminClick }: HeaderProps) {
  const [logo, setLogo] = useState<string | null>(() => {
    return localStorage.getItem("cmxLogo");
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleLogoUpdate = () => {
      const updatedLogo = localStorage.getItem("cmxLogo");
      setLogo(updatedLogo);
    };

    window.addEventListener("logoUpdated", handleLogoUpdate);
    return () => window.removeEventListener("logoUpdated", handleLogoUpdate);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogo(result);
        localStorage.setItem("cmxLogo", result);
        window.dispatchEvent(new Event("logoUpdated"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="CMX Logo" className="w-8 h-8 object-contain" />
            ) : (
              <Award className="w-8 h-8 text-blue-600" />
            )}
            <span className="text-xl font-semibold text-gray-900">Code MorphicX</span>
          </div>
          {!logo && (
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Logo
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
        {showAdminLink && (
          <button
            onClick={onAdminClick}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Admin Login
          </button>
        )}
      </div>
    </header>
  );
}
