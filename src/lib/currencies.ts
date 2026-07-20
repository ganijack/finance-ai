export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  flag: string;
  popular: boolean;
}

export const CURRENCIES: CurrencyInfo[] = [
  // Popular currencies (pinned at top)
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID", flag: "🇮🇩", popular: true },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US", flag: "🇺🇸", popular: true },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE", flag: "🇪🇺", popular: true },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB", flag: "🇬🇧", popular: true },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP", flag: "🇯🇵", popular: true },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG", flag: "🇸🇬", popular: true },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY", flag: "🇲🇾", popular: true },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU", flag: "🇦🇺", popular: true },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN", flag: "🇨🇳", popular: true },
  { code: "KRW", symbol: "₩", name: "South Korean Won", locale: "ko-KR", flag: "🇰🇷", popular: true },
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN", flag: "🇮🇳", popular: true },
  { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH", flag: "🇹🇭", popular: true },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "en-PH", flag: "🇵🇭", popular: true },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN", flag: "🇻🇳", popular: true },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA", flag: "🇨🇦", popular: true },

  // Other currencies (alphabetical)
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE", flag: "🇦🇪", popular: false },
  { code: "ARS", symbol: "$", name: "Argentine Peso", locale: "es-AR", flag: "🇦🇷", popular: false },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD", flag: "🇧🇩", popular: false },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR", flag: "🇧🇷", popular: false },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH", flag: "🇨🇭", popular: false },
  { code: "CLP", symbol: "$", name: "Chilean Peso", locale: "es-CL", flag: "🇨🇱", popular: false },
  { code: "COP", symbol: "$", name: "Colombian Peso", locale: "es-CO", flag: "🇨🇴", popular: false },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", locale: "cs-CZ", flag: "🇨🇿", popular: false },
  { code: "DKK", symbol: "kr", name: "Danish Krone", locale: "da-DK", flag: "🇩🇰", popular: false },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", locale: "ar-EG", flag: "🇪🇬", popular: false },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "en-HK", flag: "🇭🇰", popular: false },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", locale: "hu-HU", flag: "🇭🇺", popular: false },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", locale: "he-IL", flag: "🇮🇱", popular: false },
  { code: "ISK", symbol: "kr", name: "Icelandic Króna", locale: "is-IS", flag: "🇮🇸", popular: false },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE", flag: "🇰🇪", popular: false },
  { code: "MXN", symbol: "$", name: "Mexican Peso", locale: "es-MX", flag: "🇲🇽", popular: false },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG", flag: "🇳🇬", popular: false },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO", flag: "🇳🇴", popular: false },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ", flag: "🇳🇿", popular: false },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", locale: "es-PE", flag: "🇵🇪", popular: false },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "ur-PK", flag: "🇵🇰", popular: false },
  { code: "PLN", symbol: "zł", name: "Polish Złoty", locale: "pl-PL", flag: "🇵🇱", popular: false },
  { code: "QAR", symbol: "ر.ق", name: "Qatari Riyal", locale: "ar-QA", flag: "🇶🇦", popular: false },
  { code: "RON", symbol: "lei", name: "Romanian Leu", locale: "ro-RO", flag: "🇷🇴", popular: false },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", locale: "ru-RU", flag: "🇷🇺", popular: false },
  { code: "SAR", symbol: "ر.س", name: "Saudi Riyal", locale: "ar-SA", flag: "🇸🇦", popular: false },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE", flag: "🇸🇪", popular: false },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR", flag: "🇹🇷", popular: false },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar", locale: "zh-TW", flag: "🇹🇼", popular: false },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", locale: "uk-UA", flag: "🇺🇦", popular: false },
  { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA", flag: "🇿🇦", popular: false },
];

export function getCurrencyByCode(code: string): CurrencyInfo {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0]; // Default to IDR
}

export function getPopularCurrencies(): CurrencyInfo[] {
  return CURRENCIES.filter(c => c.popular);
}

export function getOtherCurrencies(): CurrencyInfo[] {
  return CURRENCIES.filter(c => !c.popular);
}
