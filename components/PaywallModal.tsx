
import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Crown, ShieldCheck, Loader2, Star, Sparkles, Infinity, AlertCircle } from 'lucide-react';
import { purchasePackage, getOfferings, restorePurchases } from '../services/subscriptionService';
import { PurchasesPackage, PurchasesOffering } from '../types';

interface PaywallModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfferings = async () => {
        try {
            const offerings = await getOfferings();
            if (offerings && offerings.current) {
                setCurrentOffering(offerings.current);
                // Default to annual if available, otherwise monthly
                if (offerings.current.annual) {
                    setSelectedPackage(offerings.current.annual);
                } else if (offerings.current.monthly) {
                    setSelectedPackage(offerings.current.monthly);
                } else if (offerings.current.availablePackages.length > 0) {
                     setSelectedPackage(offerings.current.availablePackages[0]);
                }
            } else {
                // If no offerings are configured in RevenueCat yet
                // Use a mock offering for visual purposes if real data is missing in dev
                setError("No available products found.");
            }
        } catch (e) {
            setError("Failed to load products. Check your connection.");
        } finally {
            setInitializing(false);
        }
    };
    loadOfferings();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPackage) return;
    
    setLoading(true);
    try {
      const success = await purchasePackage(selectedPackage);
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error("Purchase failed", error);
      alert("Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
      setLoading(true);
      try {
          const success = await restorePurchases();
          if (success) {
              // alert("Purchases restored successfully!");
              onSuccess();
          } else {
              alert("No active subscriptions found to restore.");
          }
      } catch (e) {
          alert("Failed to restore purchases.");
      } finally {
          setLoading(false);
      }
  }

  // Fallback UI if initialization is happening
  if (initializing) {
      return (
          <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={48} />
          </div>
      )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col lg:flex-row animate-in fade-in duration-300">
      
      {/* Mobile Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/20 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors lg:hidden"
      >
        <X size={24} />
      </button>

      {/* Left Panel: Visuals & Value Prop */}
      <div className="relative hidden lg:flex flex-col justify-between w-full lg:w-[45%] bg-zinc-900 overflow-hidden p-16">
        {/* Animated Background Mesh */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-sm font-medium text-white tracking-wide">AI POWERED</span>
          </div>
          <h1 className="text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Build beyond <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">imagination.</span>
          </h1>
          <p className="text-xl text-zinc-400 leading-relaxed max-w-md">
            Unlock the full potential of Miniapp AI with Gemini 3.0 Pro. Faster builds, premium templates, and commercial rights.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8">
            <div className="bg-black/20 backdrop-blur-lg border border-white/5 p-6 rounded-3xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                    <Crown size={20} className="text-black fill-black/20" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">PRO</div>
                <div className="text-sm text-zinc-400">Everything unlocked</div>
            </div>
             <div className="bg-black/20 backdrop-blur-lg border border-white/5 p-6 rounded-3xl">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-zinc-400">
                    <Infinity size={20} />
                </div>
                <div className="text-3xl font-bold text-white mb-1">∞</div>
                <div className="text-sm text-zinc-400">Unlimited generations</div>
            </div>
        </div>
      </div>

      {/* Right Panel: Pricing & Checkout */}
      <div className="flex-1 bg-zinc-950 flex flex-col justify-center p-6 sm:p-12 lg:p-24 relative overflow-y-auto">
         {/* Desktop Close Button */}
         <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors hidden lg:block"
        >
            <X size={24} />
        </button>

        <div className="max-w-md mx-auto w-full">
            <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>
                <p className="text-zinc-500">Choose the plan that fits your workflow.</p>
            </div>

            {error ? (
                <div className="bg-red-900/20 border border-red-900/50 rounded-2xl p-6 text-center mb-8">
                    <AlertCircle className="mx-auto text-red-500 mb-2" />
                    <p className="text-red-400 text-sm">{error}</p>
                    <p className="text-zinc-500 text-xs mt-2">
                        Note: If you are the developer, ensure you have created an 'Offering' in RevenueCat with packages.
                    </p>
                </div>
            ) : (
                <>
                {/* Plan Toggle */}
                <div className="flex flex-col gap-3 mb-8">
                    {currentOffering?.availablePackages.map((pkg) => {
                        const isSelected = selectedPackage?.identifier === pkg.identifier;
                        const isAnnual = pkg.packageType === 'ANNUAL';
                        return (
                            <button
                                key={pkg.identifier}
                                onClick={() => setSelectedPackage(pkg)}
                                className={`
                                    relative w-full p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group
                                    ${isSelected 
                                        ? 'bg-zinc-900 border-white text-white' 
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}
                                `}
                            >
                                <div className="flex flex-col items-start">
                                    <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                        {pkg.product.title}
                                    </span>
                                    {isAnnual && (
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20 uppercase tracking-wide mt-1">
                                            Best Value
                                        </span>
                                    )}
                                </div>
                                <div className="text-lg font-bold">
                                    {pkg.product.priceString}
                                </div>
                                {isSelected && (
                                    <div className="absolute inset-0 border-2 border-white rounded-2xl pointer-events-none"></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Pricing Display (Summary) */}
                <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-bold text-white tracking-tight">
                        {selectedPackage?.product.priceString || '--'}
                    </span>
                    <span className="text-xl text-zinc-500 font-medium">
                        {selectedPackage?.packageType === 'ANNUAL' ? '/year' : '/month'}
                    </span>
                </div>
                </>
            )}

            {/* Features List */}
            <div className="space-y-4 mb-10">
                 {[
                    "Access to Gemini 3.0 Pro Model",
                    "Unlimited App Generations",
                    "Premium Templates Gallery",
                    "Commercial Usage Rights",
                    "Priority GPU Processing",
                    "Export Code to Zip"
                 ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                            <Check size={12} className="text-green-500" />
                        </div>
                        <span className="text-zinc-300 text-sm">{feature}</span>
                    </div>
                 ))}
            </div>

            {/* CTA Button */}
            <button
                onClick={handlePurchase}
                disabled={loading || !!error || !selectedPackage}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
            >
                {loading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Processing Payment...</span>
                    </>
                ) : (
                    <>
                        <span>{error ? 'Unavailable' : 'Start Pro Access'}</span>
                        <ArrowRightIcon />
                    </>
                )}
            </button>

            <div className="flex items-center justify-center gap-6 text-xs text-zinc-600 font-medium">
                <button onClick={handleRestore} className="hover:text-zinc-400 transition-colors">Restore Purchases</button>
                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                <button className="hover:text-zinc-400 transition-colors">Terms</button>
                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                <button className="hover:text-zinc-400 transition-colors">Privacy</button>
            </div>
        </div>
      </div>
    </div>
  );
};

// Simple icon component helper
const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
)

export default PaywallModal;
