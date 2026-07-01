"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import ModernInput from "@/components/ui/ModernInput";
import ModernButton from "@/components/ui/ModernButton";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await loginAction(formData);
      if (res?.success) {
        (await import('sweetalert2')).default.fire({
          icon: 'success',
          title: 'Login Berhasil',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          router.push('/');
          router.refresh();
        });
      } else {
        throw new Error(res?.error || "Gagal login");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      (await import('sweetalert2')).default.fire({
        icon: 'error',
        title: 'Gagal',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 border border-gray-100 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-5 text-white text-3xl shadow-[0_4px_20px_rgba(59,130,246,0.4),inset_0_2px_0_rgba(255,255,255,0.3)] transform rotate-3">
            <FontAwesomeIcon icon={faLock} className="-rotate-3" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Login Admin</h1>
          <p className="text-sm font-bold text-gray-400 mt-2 tracking-wide uppercase">Buku Kas SD</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <ModernInput 
            label="Username"
            name="username"
            type="text"
            required
            placeholder="Masukkan username"
            icon={faUser}
            iconColorClass="bg-blue-400"
          />
          
          <ModernInput 
            label="Password"
            name="password"
            type="password"
            required
            placeholder="Masukkan password"
            icon={faLock}
            iconColorClass="bg-gray-400"
          />

          <div className="pt-2">
            <ModernButton 
              type="submit" 
              isLoading={loading}
              icon={faSignInAlt}
              variant="primary"
            >
              Masuk
            </ModernButton>
          </div>
        </form>
      </div>
    </div>
  );
}
