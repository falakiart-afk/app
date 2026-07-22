import React from 'react';

interface BrandLogoProps {
  className?: string;
  isDarkTheme?: boolean;
}

export default function BrandLogo({ className = '', isDarkTheme = true }: BrandLogoProps) {
  // Retrieve settings from localStorage
  const [settings, setSettings] = React.useState(() => {
    const saved = localStorage.getItem('store_branding_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: 'CASArt',
      tagline: 'E-Commerce COD Hub',
      logoType: 'css' as 'css' | 'image',
      logoUrl: '',
    };
  });

  // Listen to localstorage updates in case settings change
  React.useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('store_branding_settings');
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {}
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-window updates
    window.addEventListener('branding_settings_updated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('branding_settings_updated', handleStorageChange);
    };
  }, []);

  if (settings.logoType === 'image' && settings.logoUrl) {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src={settings.logoUrl} 
          alt={settings.name} 
          className="h-8 max-h-10 max-w-[200px] object-contain" 
          referrerPolicy="no-referrer" 
        />
      </div>
    );
  }

  // Pure CSS-replicated premium "CASArt." logo from the user's attachment!
  const name = settings.name || 'CASArt';
  let part1 = name;
  let part2 = '';
  
  // Split logic to replicate the "CAS" (bold uppercase) and "Art." (white on black rectangle + dot)
  if (name.toLowerCase().startsWith('cas') && name.length > 3) {
    part1 = name.substring(0, 3).toUpperCase(); // e.g. "CAS"
    part2 = name.substring(3);                  // e.g. "Art"
  } else if (name.includes(' ')) {
    const parts = name.split(' ');
    part1 = parts[0].toUpperCase();
    part2 = parts.slice(1).join(' ');
  } else {
    // If no clear split, split in half or just use part1
    part1 = name;
  }

  return (
    <div className={`flex items-center gap-1 font-sans select-none ${className}`}>
      {/* "CAS" styling: extra bold condensed display font */}
      <span className={`font-black tracking-tighter text-xl sm:text-2xl uppercase ${isDarkTheme ? 'text-white' : 'text-black'}`}>
        {part1}
      </span>
      
      {part2 && (
        <span className="flex items-center">
          {/* "Art." styling: white text on solid black rectangle with slight slant */}
          <span className={`px-2.5 py-0.5 rounded-xs font-black text-sm sm:text-base -skew-x-6 tracking-tight ${isDarkTheme ? 'bg-blue-500 text-black' : 'bg-black text-white'}`}>
            {part2}
          </span>
          {/* Black/Blue Dot at the end matching the user's logo "." */}
          <span className={`w-1.5 h-1.5 rounded-full ml-0.5 shrink-0 ${isDarkTheme ? 'bg-blue-400' : 'bg-black'}`}></span>
        </span>
      )}
    </div>
  );
}
