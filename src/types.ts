export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  headerBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  badgeBg: string;
  badgeText: string;
  fontClass: string;
  metaFontClass: string;
}
