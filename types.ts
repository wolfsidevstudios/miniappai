export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedApp {
  id: string;
  prompt: string;
  code: string; // The full HTML string of the micro-app
  timestamp: number;
  status: 'generating' | 'ready' | 'error' | 'updating';
  errorMessage?: string;
  history: ChatMessage[];
}

export interface PromptSuggestion {
  text: string;
  emoji: string;
  category: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  emoji: string;
  prompt: string;
  tags: string[];
  previewColor: string;
}

export interface UserSubscription {
  isPro: boolean;
  expirationDate?: number;
}

// Add Global Window Definition for RevenueCat
declare global {
    interface Window {
        Purchases: any;
    }
}

// RevenueCat Type Definitions
export interface PurchasesEntitlementInfo {
  identifier: string;
  isActive: boolean;
  willRenew: boolean;
  periodType: string;
  latestPurchaseDate: string;
  originalPurchaseDate: string;
  expirationDate: string | null;
  store: string;
  productIdentifier: string;
  isSandbox: boolean;
  unsubscribeDetectedAt: string | null;
  billingIssueDetectedAt: string | null;
}

export interface PurchasesEntitlementInfos {
  all: { [key: string]: PurchasesEntitlementInfo };
  active: { [key: string]: PurchasesEntitlementInfo };
}

export interface CustomerInfo {
  entitlements: PurchasesEntitlementInfos;
  activeSubscriptions: string[];
  allPurchasedProductIdentifiers: string[];
  firstSeen: string;
  originalAppUserId: string;
  requestDate: string;
  latestExpirationDate: string | null;
}

export interface PurchasesStoreProduct {
  identifier: string;
  description: string;
  title: string;
  price: number;
  priceString: string;
  currencyCode: string;
}

export interface PurchasesPackage {
  readonly identifier: string;
  readonly packageType: string; // 'LIFETIME' | 'ANNUAL' | 'SIX_MONTH' | 'THREE_MONTH' | 'TWO_MONTH' | 'MONTHLY' | 'WEEKLY' | 'UNKNOWN' | 'CUSTOM';
  readonly product: PurchasesStoreProduct;
  readonly offeringIdentifier: string;
}

export interface PurchasesOffering {
  readonly identifier: string;
  readonly serverDescription: string;
  readonly metadata: { [key: string]: unknown };
  readonly availablePackages: PurchasesPackage[];
  readonly lifetime: PurchasesPackage | null;
  readonly annual: PurchasesPackage | null;
  readonly sixMonth: PurchasesPackage | null;
  readonly threeMonth: PurchasesPackage | null;
  readonly twoMonth: PurchasesPackage | null;
  readonly monthly: PurchasesPackage | null;
  readonly weekly: PurchasesPackage | null;
}

export interface PurchasesOfferings {
  readonly all: { [key: string]: PurchasesOffering };
  readonly current: PurchasesOffering | null;
}