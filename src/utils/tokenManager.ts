import CryptoJS from "crypto-js";

// Encryption key
const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
  "your-secret-key-change-in-production";

// Token types
export enum TokenType {
  ACCESS_TOKEN = "accessToken",
  REFRESH_TOKEN = "refreshToken",
  EMAIL_VERIFICATION_TOKEN = "emailVerificationToken",
  RESET_PASSWORD_TOKEN = "resetPasswordToken",
}

// Cookie names - obfuscated for security
const COOKIE_NAMES: Record<TokenType, string> = {
  [TokenType.ACCESS_TOKEN]: "iat",
  [TokenType.REFRESH_TOKEN]: "irt",
  [TokenType.EMAIL_VERIFICATION_TOKEN]: "ievt",
  [TokenType.RESET_PASSWORD_TOKEN]: "irpt",
};

// Auth operation types
type AuthOperation = "verify-email" | "reset-password";
type AuthResponseOperation =
  | "register"
  | "login-not-verified"
  | "login-success"
  | "verify-otp"
  | "forgot-password";

// Token attributes interface
interface TokenAttributes {
  accessToken?: string;
  refreshToken?: string;
  emailVerificationToken?: string;
  resetPasswordToken?: string;
}

// Auth response interface
interface AuthResponse {
  data?: {
    attributes?: {
      tokens?: TokenAttributes;
      emailVerificationToken?: string;
      resetPasswordToken?: string;
    };
  };
}

// Encrypt function
const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Error encrypting token:", error);
    throw new Error("Failed to encrypt token");
  }
};

// Decrypt function with enhanced error handling
const decrypt = (encryptedText: string): string => {
  try {
    // Validate input
    if (!encryptedText || typeof encryptedText !== "string") {
      throw new Error("Invalid encrypted text provided");
    }

    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);

    // Check if decryption was successful
    if (bytes.sigBytes <= 0) {
      throw new Error("Failed to decrypt - invalid ciphertext");
    }

    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

    // Validate UTF-8 output
    if (!decryptedText) {
      throw new Error("Malformed UTF-8 data or invalid decryption key");
    }

    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error);
    // Clear the corrupted cookie
    return "";
  }
};

// Set token in encrypted cookie
export const setToken = (
  tokenType: TokenType,
  token: string,
  expiryHours: number = 168
): void => {
  try {
    if (!token || typeof token !== "string") {
      throw new Error("Invalid token provided");
    }

    const encrypted = encrypt(token);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiryHours);

    document.cookie = `${
      COOKIE_NAMES[tokenType]
    }=${encrypted}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.error("Error setting token:", error);
  }
};

// Get token from encrypted cookie
export const getToken = (tokenType: TokenType): string | null => {
  try {
    // Check if we're in browser environment
    if (typeof document === "undefined") {
      return null;
    }

    const cookieName = COOKIE_NAMES[tokenType];
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === cookieName && value) {
        const decryptedValue = decrypt(value);

        // If decryption failed or returned empty string, remove the corrupted cookie
        if (!decryptedValue) {
          removeToken(tokenType);
          return null;
        }

        return decryptedValue;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Remove token
export const removeToken = (tokenType: TokenType): void => {
  try {
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE_NAMES[tokenType]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

// Clear all tokens
export const clearAllTokens = (): void => {
  try {
    Object.values(TokenType).forEach((tokenType) => {
      removeToken(tokenType);
    });
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

// Get appropriate token for API calls
export const getApiToken = (): string | null => {
  // For regular API calls, use access token
  return getToken(TokenType.ACCESS_TOKEN);
};

// Get token for specific auth operations
export const getAuthToken = (operation: AuthOperation): string | null => {
  try {
    switch (operation) {
      case "verify-email":
        return getToken(TokenType.EMAIL_VERIFICATION_TOKEN);
      case "reset-password":
        return getToken(TokenType.RESET_PASSWORD_TOKEN);
      default:
        return null;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

// Handle auth response and store tokens
export const handleAuthResponse = (
  response: AuthResponse,
  operation: AuthResponseOperation
): void => {
  try {
    const data = response?.data;

    if (!data) {
      console.warn("No data in auth response");
      return;
    }

    switch (operation) {
      case "register":
      case "login-not-verified":
        if (data.attributes?.emailVerificationToken) {
          setToken(
            TokenType.EMAIL_VERIFICATION_TOKEN,
            data.attributes.emailVerificationToken,
            1
          ); // 1 hour
        }
        break;

      case "login-success":
      case "verify-otp":
        if (data.attributes?.tokens) {
          // Clear verification tokens first
          removeToken(TokenType.EMAIL_VERIFICATION_TOKEN);
          removeToken(TokenType.RESET_PASSWORD_TOKEN);

          // Set access and refresh tokens
          if (data.attributes.tokens.accessToken) {
            setToken(
              TokenType.ACCESS_TOKEN,
              data.attributes.tokens.accessToken,
              1
            ); // 1 hour
          }
          if (data.attributes.tokens.refreshToken) {
            setToken(
              TokenType.REFRESH_TOKEN,
              data.attributes.tokens.refreshToken,
              30
            ); // 1 month
          }
        }
        break;

      case "forgot-password":
        if (data.attributes?.resetPasswordToken) {
          setToken(
            TokenType.RESET_PASSWORD_TOKEN,
            data.attributes.resetPasswordToken,
            2
          ); // 2 hours
        }
        break;

      default:
        console.warn("Unknown auth operation:", operation);
    }
  } catch (error) {
    console.error("Error handling auth response:", error);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  try {
    return getToken(TokenType.ACCESS_TOKEN) !== null;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Check if tokens need refresh
export const needsTokenRefresh = (): boolean => {
  try {
    const accessToken = getToken(TokenType.ACCESS_TOKEN);
    const refreshToken = getToken(TokenType.REFRESH_TOKEN);

    if (!accessToken && refreshToken) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking token refresh need:", error);
    return false;
  }
};

// Utility function to clear corrupted tokens
export const clearCorruptedTokens = (): void => {
  try {
    // Test each token and remove if corrupted
    Object.values(TokenType).forEach((tokenType) => {
      const token = getToken(tokenType);
      if (token === null) {
        // If getToken returns null due to corruption, the corrupted cookie is already removed
        console.info(`Cleared corrupted token: ${tokenType}`);
      }
    });
  } catch (error) {
    console.error("Error clearing corrupted tokens:", error);
  }
};

// Enhanced token validation
export const validateToken = (token: string): boolean => {
  try {
    if (!token || typeof token !== "string") {
      return false;
    }

    // Basic JWT format check (optional)
    const parts = token.split(".");
    return parts.length === 3;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};
