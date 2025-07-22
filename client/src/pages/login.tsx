import { useState } from "react";
import { useLocation } from "wouter";
import { FloatingCard } from "@/components/ui/floating-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { University, User, Lock, ShieldCheck, LogIn } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation - in real app this would connect to auth service
    if (username && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Bank Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
              <University className="text-white text-xl" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold gradient-text">
                NextGen Auditing
              </h1>
              <p className="text-gray-400 text-sm">
                Enterprise Analytics Platform
              </p>
            </div>
          </div>
          <p className="text-gray-300 text-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Secure • Intelligent • Professional
          </p>
        </div>

        {/* 3D Animated Login Card */}
        <FloatingCard>
          <h2 className="text-xl font-semibold mb-6 text-center">
            AI Driven Insights Bot
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-300"
              >
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 py-3 rounded-lg font-semibold neon-glow transition-all duration-300"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Secure Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Protected by enterprise-grade encryption
            </p>
          </div>
        </FloatingCard>
      </div>
    </div>
  );
}
