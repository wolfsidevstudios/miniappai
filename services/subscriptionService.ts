import { PurchasesOfferings, PurchasesPackage } from '../types';

const API_KEY = "rcb_sb_JiuHJVWwqZtqrDHkJWvfPMvjG";
// Switch to Unpkg UMD build which is more reliable for direct browser injection
const SCRIPT_URL = "https://unpkg.com/@revenuecat/purchases-js@12.2.0/dist/purchases.umd.js";

let purchasesInstance: any = null;

// Robustly load the RevenueCat SDK via script tag injection
const loadRevenueCatScript = (): Promise<any> => {
    return new Promise((resolve) => {
        if (window.Purchases) {
            resolve(window.Purchases);
            return;
        }

        const script = document.createElement('script');
        script.src = SCRIPT_URL;
        script.async = true;
        script.onload = () => {
            // Check for the global object
            if (window.Purchases) {
                resolve(window.Purchases);
            } else {
                console.error("RevenueCat script loaded but window.Purchases is missing");
                resolve(null);
            }
        };
        script.onerror = (e) => {
            console.error("Failed to load RevenueCat script from CDN", e);
            resolve(null);
        };
        document.head.appendChild(script);
    });
};

const getPurchases = async () => {
    if (purchasesInstance) return purchasesInstance;

    try {
        const Purchases = await loadRevenueCatScript();
        
        if (!Purchases) {
            console.warn("RevenueCat SDK unavailable.");
            return null;
        }

        // Configure if not already configured
        if (!Purchases.isConfigured()) {
             Purchases.configure({ 
                apiKey: API_KEY,
                appUserID: null // Generates an anonymous ID if null
            });
        }
        
        purchasesInstance = Purchases;
        return Purchases;
    } catch (error) {
        console.warn("Error initializing RevenueCat:", error);
        return null;
    }
};

export const checkSubscriptionStatus = async (): Promise<boolean> => {
  try {
    const Purchases = await getPurchases();
    if (!Purchases) return false;

    const customerInfo = await Purchases.getSharedInstance().getCustomerInfo();
    
    // Check for any active entitlement
    const entitlements = customerInfo.entitlements.active;
    return Object.keys(entitlements).length > 0;
  } catch (error) {
    console.warn("Error checking subscription status (offline or unconfigured):", error);
    return false;
  }
};

export const getOfferings = async (): Promise<PurchasesOfferings | null> => {
    try {
        const Purchases = await getPurchases();
        if (!Purchases) return null;

        const offerings = await Purchases.getSharedInstance().getOfferings();
        return offerings as unknown as PurchasesOfferings;
    } catch (error) {
        console.error("Error fetching offerings:", error);
        return null;
    }
}

export const purchasePackage = async (rcPackage: PurchasesPackage): Promise<boolean> => {
  try {
    const Purchases = await getPurchases();
    if (!Purchases) return false;

    const { customerInfo } = await Purchases.getSharedInstance().purchasePackage(rcPackage as any);
    
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch (error) {
    console.error("Purchase failed or cancelled:", error);
    return false;
  }
};

export const restorePurchases = async (): Promise<boolean> => {
    try {
        const Purchases = await getPurchases();
        if (!Purchases) return false;

        const customerInfo = await Purchases.getSharedInstance().restorePurchases();
        return Object.keys(customerInfo.entitlements.active).length > 0;
    } catch (error) {
        console.error("Error restoring purchases:", error);
        return false;
    }
}

export const getCustomerId = async (): Promise<string> => {
    try {
        const Purchases = await getPurchases();
        if (!Purchases) return "";
        return await Purchases.getSharedInstance().getAppUserID();
    } catch (e) {
        return "";
    }
}