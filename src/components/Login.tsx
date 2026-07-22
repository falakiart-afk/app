import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogIn, 
  Globe, 
  Sparkles,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import BrandLogo from './BrandLogo';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default credentials: admin / admin123
  // They can be configured or stored in localStorage
  const [adminUsername, setAdminUsername] = useState(() => localStorage.getItem('cpanel_username') || 'admin');
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('cpanel_password') || 'admin123');
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [newPassword, setNewPassword] = useState(adminPassword);
  const [credsSuccess, setCredsSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور / Veuillez remplir tous les champs');
      return;
    }

    if (username.trim().toLowerCase() === adminUsername.toLowerCase() && password === adminPassword) {
      if (rememberMe) {
        localStorage.setItem('cpanel_is_authenticated', 'true');
      } else {
        sessionStorage.setItem('cpanel_is_authenticated', 'true');
      }
      onLoginSuccess();
    } else {
      setError('معلومات الدخول غير صحيحة / Identifiants incorrects');
    }
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredsSuccess(false);

    if (!newUsername.trim() || newPassword.length < 4) {
      alert('اسم المستخدم أو كلمة المرور قصيرة جداً (على الأقل 4 أحرف)');
      return;
    }

    localStorage.setItem('cpanel_username', newUsername.trim());
    localStorage.setItem('cpanel_password', newPassword);
    setAdminUsername(newUsername.trim());
    setAdminPassword(newPassword);
    setCredsSuccess(true);
    setTimeout(() => {
      setCredsSuccess(false);
      setIsChangingCredentials(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Visual Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Top Banner Accent representing Morocco/E-commerce */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-emerald-600 to-red-600"></div>

      <div className="w-full max-w-md bg-[#12141C] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 transition-all duration-300 hover:border-gray-750">
        
        {/* Header Branding */}
        <div className="p-6 pb-4 text-center border-b border-gray-800/60 bg-[#161922]/50">
          <div className="mx-auto w-12 h-12 bg-blue-950/40 border border-blue-500/30 text-blue-400 rounded-xl flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          
          <div className="flex justify-center mb-2">
            <BrandLogo isDarkTheme={true} />
          </div>
          <h2 className="text-xs font-bold text-blue-400 tracking-wider uppercase flex items-center justify-center gap-1.5">
            <span>Control Panel / لوحة التحكم</span>
            <Sparkles className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
          </h2>
          <p className="text-xs text-gray-400 mt-1">بوابة الدخول إلى لوحة إدارة الطلبات الذكية</p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <Globe className="h-3 w-3 text-emerald-500" />
            <span>Morocco COD & WooCommerce Hub</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {!isChangingCredentials ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {error && (
                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span className="font-bold">{error}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-400 font-bold">اسم المستخدم / Identifiant</label>
                  <span className="text-[10px] text-gray-500">Default: {adminUsername}</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full bg-[#0D0E12] border border-gray-800 focus:border-blue-500 focus:ring-0 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 transition-colors focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-400 font-bold">كلمة المرور / Mot de passe</label>
                  <span className="text-[10px] text-gray-500">Default: {adminPassword}</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0D0E12] border border-gray-800 focus:border-blue-500 focus:ring-0 rounded-lg pl-9 pr-10 py-2 text-sm text-white placeholder-gray-600 transition-colors focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Quick Help */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-gray-800 bg-[#0D0E12] text-blue-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
                  />
                  <span>تذكرني / Se souvenir de moi</span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                <span>تسجيل الدخول / Se Connecter</span>
              </button>

              {/* Configure credentials link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewUsername(adminUsername);
                    setNewPassword(adminPassword);
                    setIsChangingCredentials(true);
                  }}
                  className="text-[10px] font-bold text-gray-500 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  ⚙️ تعديل معلومات الدخول / Modifier les identifiants
                </button>
              </div>

            </form>
          ) : (
            /* Configure credentials view */
            <form onSubmit={handleUpdateCredentials} className="space-y-4">
              <div className="text-center text-xs pb-1">
                <span className="font-bold text-blue-400">تغيير معلومات الدخول للمدير</span>
                <p className="text-[10px] text-gray-500 mt-0.5">Customize your login details for extra privacy.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 font-bold">New Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-[#0D0E12] border border-gray-800 focus:border-blue-500 focus:ring-0 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 font-bold">New Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0D0E12] border border-gray-800 focus:border-blue-500 focus:ring-0 rounded-lg px-3 py-2 text-sm text-white focus:outline-hidden"
                  required
                  minLength={4}
                />
              </div>

              {credsSuccess && (
                <div className="p-2 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-[10px] text-center font-bold">
                  ✓ تم الحفظ بنجاح! / Modifié avec succès!
                </div>
              )}

              <div className="flex gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => setIsChangingCredentials(false)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-lg cursor-pointer transition-colors"
                >
                  رجوع / Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
                >
                  حفظ / Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#161922]/30 border-t border-gray-800/40 text-center text-[10px] text-gray-500 font-medium">
          Moroccan COD Operations Suite © {new Date().getFullYear()}
        </div>

      </div>
    </div>
  );
}
