import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Order, User, AdminStats, ProductSize } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'vinoz_db.json');

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  users: User[];
  meta: {
    lastUpdated: string;
    version: string;
  };
}

// Initial Curated Catalogue for Vino’z Fashion - Dresses & Fine Hair Accessories
const INITIAL_PRODUCTS: Product[] = [
  // --- 1. DRESSES ---
  {
    id: 'vnz-101',
    name: 'The Bordeaux Silk Slip Dress',
    subtitle: '100% Mulberry Silk, Bias Cut',
    category: 'Dresses',
    price: 185,
    compareAtPrice: 220,
    description:
      'Cut on the bias from lustrous 19mm mulberry silk charmeuse, this iconic evening slip dress drapes effortlessly over natural contours. Features delicate adjustable spaghetti straps, a soft cowl neckline, and a subtle side slit for graceful movement.',
    details: [
      '100% Grade 6A Mulberry Silk Charmeuse',
      'Fluid bias-cut drape with French seams',
      'Self-lined cowl bodice with delicate back drape',
      'Dry clean only or delicate hand wash cold',
      'Model is 5’9” wearing size S',
    ],
    fabric: '100% Pure Mulberry Silk Charmeuse',
    care: 'Dry clean recommended. Gentle hand wash in cool water with silk detergent.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 4, S: 8, M: 6, L: 3, XL: 2, 'One Size': 0 },
    colors: [
      { name: 'Vino Burgundy', hex: '#68242A' },
      { name: 'Midnight Noir', hex: '#1C1917' },
      { name: 'Champagne Pearl', hex: '#EBE2D5' },
    ],
    tags: ['Evening', 'Silk', 'Bestseller', 'Holiday'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 52,
    createdAt: new Date('2026-08-01').toISOString(),
  },
  {
    id: 'vnz-102',
    name: 'Evelyn Tiered Chiffon Maxi Gown',
    subtitle: 'Airy Pleated Organza with Floral Jacquard',
    category: 'Dresses',
    price: 245,
    compareAtPrice: 285,
    description:
      'Float into gala evenings and garden ceremonies in this ethereal maxi gown. Tailored with romantic tiered ruffles, a fitted smocked bodice, and a square neckline with self-tie shoulder bows.',
    details: [
      '100% Lightweight Silk-Georgette and Chiffon',
      'Tiered silhouette with micro-pleats',
      'Smocked back panel allows comfortable flexible fit',
      'Fully lined with breathable viscose',
    ],
    fabric: 'Silk-Georgette & Viscose Lining',
    care: 'Dry clean only. Steam softly to refresh tiered layers.',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 3, S: 6, M: 5, L: 2, XL: 1, 'One Size': 0 },
    colors: [
      { name: 'Rosewater Blush', hex: '#E7C7C5' },
      { name: 'Noir Flora', hex: '#262426' },
    ],
    tags: ['Gown', 'Occasion', 'Wedding Guest', 'Dresses'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 38,
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'vnz-103',
    name: 'Aurelia Backless Satin Halter Gown',
    subtitle: 'Heavyweight Fluid Satin with Sculpted Neckline',
    category: 'Dresses',
    price: 215,
    compareAtPrice: 250,
    description:
      'An alluring red-carpet silhouette rendered in fluid liquid champagne satin. Features a high cowl halter neck, a dramatic open back, and a column skirt that sweeps gracefully as you walk.',
    details: [
      'Heavyweight 22mm Silk-Satin Blend',
      'High draped halter collar with double button closure',
      'Open back with gentle contour darting',
      'Concealed invisible side zipper',
    ],
    fabric: '22mm Silk-Satin Blend',
    care: 'Dry clean only. Store on padded hanger.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 5, S: 7, M: 6, L: 4, XL: 2, 'One Size': 0 },
    colors: [
      { name: 'Champagne Gold', hex: '#DECBA4' },
      { name: 'Bordeaux Vino', hex: '#68242A' },
      { name: 'Midnight Onyx', hex: '#1C1917' },
    ],
    tags: ['Cocktail', 'Halter', 'Evening', 'New Arrival'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 29,
    createdAt: new Date('2026-08-20').toISOString(),
  },
  {
    id: 'vnz-104',
    name: 'Isabella French Linen Wrap Sundress',
    subtitle: '100% Normandy Flax with Flutter Sleeves',
    category: 'Dresses',
    price: 140,
    compareAtPrice: 165,
    description:
      'Tailored from pure Normandy linen with a relaxed drape and airy breathability. Features a true wrap closure with an interior tie, delicate flutter sleeves, and a flattering A-line skirt.',
    details: [
      '100% Certified French Normandy Linen',
      'True wrap construction with adjustable self-belt',
      'Flutter cap sleeves with reinforced binding',
      'Side seam pockets for casual ease',
    ],
    fabric: '100% Pure French Linen',
    care: 'Gentle machine wash cold. Hang dry or tumble dry low. Soft wrinkles are natural.',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 6, S: 9, M: 8, L: 5, XL: 3, 'One Size': 0 },
    colors: [
      { name: 'Natural Oatmeal', hex: '#DED7C8' },
      { name: 'Terracotta Clay', hex: '#B85C38' },
      { name: 'Classic Black', hex: '#1A1A1A' },
    ],
    tags: ['Linen', 'Day Dress', 'Summer', 'Bestseller'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 41,
    createdAt: new Date('2026-07-15').toISOString(),
  },
  {
    id: 'vnz-105',
    name: 'Nocturne Velvet Column Evening Dress',
    subtitle: 'Plush Crushed Velvet with High Thigh Slit',
    category: 'Dresses',
    price: 260,
    compareAtPrice: 295,
    description:
      'Crafted in rich wine bordeaux crushed velvet that catches ambient evening light. Cut in a form-grazing column silhouette with long sleeves, a jewel neckline, and a statement side slit.',
    details: [
      'Plush Silk-Rayon Velvet blend',
      'Full stretch lining for ultimate comfort',
      'Subtle shoulder pads for defined poise',
      'High side slit tailored for graceful movement',
    ],
    fabric: '82% Rayon, 18% Silk Velvet',
    care: 'Dry clean only. Steam inside out; do not iron pile directly.',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 2, S: 5, M: 6, L: 3, XL: 1, 'One Size': 0 },
    colors: [
      { name: 'Vino Velvet', hex: '#541E24' },
      { name: 'Emerald Forest', hex: '#1C3B2B' },
      { name: 'Midnight Noir', hex: '#111111' },
    ],
    tags: ['Velvet', 'Evening', 'Winter Gala', 'New Arrival'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 19,
    createdAt: new Date('2026-08-28').toISOString(),
  },
  {
    id: 'vnz-106',
    name: 'Kallista Ribbed Midi Knit Dress',
    subtitle: 'Form-Sculpting Merino Wool & Silk Knit',
    category: 'Dresses',
    price: 165,
    compareAtPrice: 195,
    description:
      'Engineered ribbing that sculpts and elongates the frame. Cut from an ultra-fine Australian Merino wool and silk yarn with a clean jewel neckline, long fitted sleeves, and a tasteful back walking slit.',
    details: [
      '75% Extra-Fine Merino Wool, 25% Mulberry Silk',
      'Varying vertical rib widths flatter curves naturally',
      'Ankle-grazing midi hemline with back slit',
      'Natural temperature-regulating breathability',
    ],
    fabric: '75% Extra-Fine Merino Wool, 25% Silk',
    care: 'Hand wash cold. Dry flat in shade. Do not tumble dry or hang.',
    images: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 4, S: 7, M: 8, L: 4, XL: 2, 'One Size': 0 },
    colors: [
      { name: 'Espresso Bronze', hex: '#4A3728' },
      { name: 'Stone Heather', hex: '#878380' },
      { name: 'Cream Ivory', hex: '#F5F0E8' },
    ],
    tags: ['Knit Dress', 'Merino', 'Fall/Winter', 'Dresses'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 34,
    createdAt: new Date('2026-09-02').toISOString(),
  },

  // --- 2. HAIR CLIPS ---
  {
    id: 'vnz-201',
    name: 'French Tortoise Acetate Claw Clip',
    subtitle: 'Hand-Polished Cellulose Acetate with Gold Spring',
    category: 'Hair Clips',
    price: 28,
    compareAtPrice: 35,
    description:
      'Handcrafted from durable, eco-friendly Italian cellulose acetate with smooth, snag-free teeth and an ultra-strong gold-plated steel spring that holds all hair types comfortably all day.',
    details: [
      'Handcrafted Italian Cellulose Acetate',
      'Strong gold-plated tension spring',
      'Rounded snag-proof teeth protect hair cuticle',
      'Length: 4.2 inches (10.5 cm)',
    ],
    fabric: 'Biodegradable Italian Cellulose Acetate',
    care: 'Wipe clean with a damp microfiber cloth. Store in jewelry pouch.',
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 24 },
    colors: [
      { name: 'Amber Tortoise', hex: '#8B4513' },
      { name: 'Blonde Horn', hex: '#D2B48C' },
      { name: 'Onyx Marble', hex: '#1C1917' },
    ],
    tags: ['Claw Clip', 'Acetate', 'Hair Accessories', 'Bestseller'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 88,
    createdAt: new Date('2026-08-10').toISOString(),
  },
  {
    id: 'vnz-202',
    name: 'Ophelia Cultured Pearl Barrette Set',
    subtitle: 'Hand-Wired Natural Seed Pearls on Polished Brass',
    category: 'Hair Clips',
    price: 34,
    compareAtPrice: 42,
    description:
      'A duo of romantic barrettes featuring hand-wired freshwater seed pearls nestled onto polished brass alligator clips. Perfect for styling side-swept locks or pinning back half-up styles.',
    details: [
      'Natural cultured freshwater seed pearls',
      '18K gold dipped brass alligator clip base',
      'Set includes 1 wide barrette and 1 slim pin',
      'Gentle tooth grip that stays securely in fine or thick hair',
    ],
    fabric: 'Freshwater Cultured Pearls & 18K Gold Dipped Brass',
    care: 'Keep away from moisture and hairspray. Buff with a dry cotton cloth.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 18 },
    colors: [
      { name: 'Lustrous Pearl & Gold', hex: '#F5EFEB' },
    ],
    tags: ['Pearl', 'Barrette', 'Bridal', 'Bestseller'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 46,
    createdAt: new Date('2026-08-18').toISOString(),
  },
  {
    id: 'vnz-203',
    name: 'Celeste Starburst Pavé Crystal Hair Pins',
    subtitle: 'Set of 3 Shimmering Celestial Bobby Pins',
    category: 'Hair Clips',
    price: 32,
    description:
      'Adorn evening buns, chignons, or loose waves with this trio of crystal-encrusted starburst bobby pins. Each faceted Austrian crystal is claw-set by hand in 18-karat gold dipped brass.',
    details: [
      'Faceted Austrian clear crystal pavé',
      'Set of 3 assorted graduated starburst pins',
      'Sturdy heavy-gauge brass pins that will not bend',
      'Packaged in signature Vino’z velvet keepsake box',
    ],
    fabric: 'Austrian Crystals & 18K Gold Plated Brass',
    care: 'Apply hairspray prior to inserting pins. Store in provided velvet box.',
    images: [
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 15 },
    colors: [
      { name: 'Crystal & Warm Gold', hex: '#DECBA4' },
      { name: 'Silver Starlight', hex: '#E2E2E2' },
    ],
    tags: ['Crystal', 'Hair Pins', 'Evening Glamour'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 22,
    createdAt: new Date('2026-08-25').toISOString(),
  },
  {
    id: 'vnz-204',
    name: 'Matte Bordeaux Minimalist Claw Duo',
    subtitle: 'Non-Slip Soft Touch Resin in Wine & Cream',
    category: 'Hair Clips',
    price: 24,
    description:
      'Curated two-piece set of curved claw clips with a velvety soft-touch matte finish. Engineered with rounded teeth that grip without creasing or pulling delicate strands.',
    details: [
      'Durable non-slip matte rubberized coating',
      'Ergonomic contour hugs the curve of the scalp',
      'Set of 2: One in Vino Wine, One in Warm Porcelain',
      'Suitable for wet or dry hair styling',
    ],
    fabric: 'Recycled Polycarbonate with Velvet-Touch Finish',
    care: 'Rinse with clear water and dry thoroughly.',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 20 },
    colors: [
      { name: 'Wine & Cream Duo', hex: '#68242A' },
    ],
    tags: ['Matte', 'Claw Clip', 'Everyday Essential'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 53,
    createdAt: new Date('2026-07-22').toISOString(),
  },
  {
    id: 'vnz-205',
    name: 'Seraphina Vintage Filigree Metal Clip',
    subtitle: 'Hand-Finished Antiqued Gold Floral Relief',
    category: 'Hair Clips',
    price: 30,
    description:
      'Inspired by Belle Époque hair jewelry, this ornate filigree clip is cast in solid brass with an antiqued gold patina, featuring intricate botanical motifs and a secure snap clasp.',
    details: [
      'Cast solid brass with heirloom antiqued finish',
      'Detailed floral and acanthus leaf embossing',
      'Strong spring-loaded French snap barrette backing',
      'Length: 3.5 inches',
    ],
    fabric: 'Antiqued Solid Brass',
    care: 'Store in a dry location. Avoid water immersion.',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 12 },
    colors: [
      { name: 'Antiqued Gold', hex: '#C5A059' },
      { name: 'Burnished Silver', hex: '#A8A9AD' },
    ],
    tags: ['Vintage', 'Filigree', 'French Barrette'],
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 17,
    createdAt: new Date('2026-08-05').toISOString(),
  },

  // --- 3. HAIR BANDS ---
  {
    id: 'vnz-301',
    name: 'Duchess Padded Silk Satin Headband',
    subtitle: '100% Mulberry Silk Charmeuse, 3cm Padded Crown',
    category: 'Hair Bands',
    price: 45,
    compareAtPrice: 55,
    description:
      'Elevate your look instantly with our iconic padded crown headband. Wrapped in ultra-soft 19mm mulberry silk charmeuse over a bendable, headache-free comfort band lined with grosgrain.',
    details: [
      '100% Grade-6A Pure Mulberry Silk',
      'Plush 30mm height padded architectural crown',
      'Flexible inner frame engineered for all-day comfort without pressure',
      'Inner grosgrain ribbon trim prevents slipping',
    ],
    fabric: '100% Mulberry Silk Charmeuse',
    care: 'Spot clean with silk detergent. Store in provided cotton dust bag.',
    images: [
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 16 },
    colors: [
      { name: 'Vino Bordeaux', hex: '#68242A' },
      { name: 'Champagne Pearl', hex: '#EBE2D5' },
      { name: 'Midnight Noir', hex: '#1C1917' },
    ],
    tags: ['Headband', 'Silk', 'Bestseller', 'Accessories'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 64,
    createdAt: new Date('2026-08-12').toISOString(),
  },
  {
    id: 'vnz-302',
    name: 'Astrid Braided Velvet Padded Band',
    subtitle: 'Rich Wine Bordeaux Velvet with Gentle Grip',
    category: 'Hair Bands',
    price: 38,
    description:
      'Artisan-braided from plush Italian cotton velvet in our signature Vino Bordeaux tone. Offers a cushioned crown silhouette with flexible temple tips that never pinch.',
    details: [
      'Plush Italian cotton velvet braid',
      'Soft padded cushion structure',
      'Ergonomic flex band fits all head sizes',
      'Non-slip interior lining',
    ],
    fabric: 'Italian Cotton Velvet',
    care: 'Gently brush pile with a soft dry brush to maintain luster.',
    images: [
      'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 14 },
    colors: [
      { name: 'Deep Wine Velvet', hex: '#582025' },
      { name: 'Espresso Velvet', hex: '#38281F' },
      { name: 'Forest Velvet', hex: '#1E3527' },
    ],
    tags: ['Braided', 'Velvet', 'Hair Band', 'Fall Trend'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 31,
    createdAt: new Date('2026-08-22').toISOString(),
  },
  {
    id: 'vnz-303',
    name: 'Aurelia Twisted 18K Gold Vermeil Band',
    subtitle: 'Sculptural Polished Brass Dipped in 18K Gold',
    category: 'Hair Bands',
    price: 48,
    description:
      'A sleek, minimalist metallic hair band featuring a delicate rope twist pattern. Flexible and lightweight, designed to slide seamlessly into swept-back hair for an effortless daytime glow.',
    details: [
      '18-Karat Gold Vermeil over premium brass',
      'Delicate 4mm rope twisted profile',
      'Comfort-molded rounded ends that prevent temple pressure',
      'Hypoallergenic and tarnish-resistant coating',
    ],
    fabric: '18K Gold Vermeil Brass',
    care: 'Polish with jewelry polishing cloth. Keep away from chlorinated water.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 10 },
    colors: [
      { name: '18K Yellow Gold', hex: '#DFC15D' },
    ],
    tags: ['Gold Vermeil', 'Metallic', 'Minimalist Band'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 19,
    createdAt: new Date('2026-08-29').toISOString(),
  },
  {
    id: 'vnz-304',
    name: 'Perla Hand-Embellished Halo Headband',
    subtitle: 'Lustrous Micro-Pearls on Ivory Satin Padding',
    category: 'Hair Bands',
    price: 52,
    compareAtPrice: 65,
    description:
      'Hand-sewn with hundreds of luminous seed pearls across a delicate ivory satin band. Ideal for bridal celebrations, galas, and romantic dinner parties.',
    details: [
      'Hand-sewn faux freshwater seed pearls and crystal beads',
      'Lustrous bridal ivory satin covering',
      'Padded crown height: 25mm',
      'Soft fabric covered ends for zero friction',
    ],
    fabric: 'Satin & Hand-Embellished Cultured Pearls',
    care: 'Handle with care. Store flat in dust pouch.',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 8 },
    colors: [
      { name: 'Ivory Pearl', hex: '#FAF5EE' },
    ],
    tags: ['Bridal', 'Pearl Headband', 'Occasion'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 37,
    createdAt: new Date('2026-07-20').toISOString(),
  },
  {
    id: 'vnz-305',
    name: 'Lina Knotted French Linen Headband',
    subtitle: 'Organic Washed Linen with Comfortable Elastic Base',
    category: 'Hair Bands',
    price: 32,
    description:
      'Crafted from breathable French washed linen featuring a centered top knot. Soft, earthy texture in Sand & Natural Oatmeal, designed for effortless casual chic styling.',
    details: [
      '100% French Washed Linen',
      'Hand-tied relaxed center knot',
      'Flexible base frame lined with soft cotton',
      'Ultra-breathable for warm climates',
    ],
    fabric: '100% French Washed Linen',
    care: 'Spot clean with mild eco detergent.',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 15 },
    colors: [
      { name: 'Natural Sand', hex: '#D8CFBC' },
      { name: 'Terracotta', hex: '#B85C38' },
      { name: 'Olive Sage', hex: '#636858' },
    ],
    tags: ['Linen', 'Knotted Band', 'Casual Chic'],
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 28,
    createdAt: new Date('2026-07-14').toISOString(),
  },

  // --- 4. EARRINGS ---
  {
    id: 'vnz-401',
    name: 'Baroque Keshi Pearl Drop Earrings',
    subtitle: 'Iridescent Natural Pearls on 18K Gold Vermeil Hooks',
    category: 'Earrings',
    price: 78,
    compareAtPrice: 95,
    description:
      'Hand-selected organic keshi freshwater pearls with high mirror luster, dangling from delicate hand-cast 18-karat gold vermeil ear hooks. Hypoallergenic and exceptionally lightweight.',
    details: [
      '100% Natural Keshi Freshwater Baroque Pearls (approx. 14-16mm)',
      '18K Gold Vermeil over 925 Sterling Silver ear hooks',
      'Organic unique shape for each artisan pair',
      'Safe for sensitive pierced ears (nickel-free)',
    ],
    fabric: 'Freshwater Baroque Pearls & 18K Gold Vermeil',
    care: 'Store away from humidity. Put on after perfume and lotion application.',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 14 },
    colors: [
      { name: 'Lustrous Pearl & Gold', hex: '#F7F3EC' },
    ],
    tags: ['Pearl', 'Earrings', 'Heirloom', 'Bestseller'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 72,
    createdAt: new Date('2026-08-04').toISOString(),
  },
  {
    id: 'vnz-402',
    name: 'Atelier Chunky Sculpted Gold Hoops',
    subtitle: 'Hollow Lightweight 18K Gold Dipped Statement Hoops',
    category: 'Earrings',
    price: 65,
    compareAtPrice: 80,
    description:
      'Engineered with a hollow interior for featherlight all-day comfort. Features an organic curved molten silhouette dipped in thick 18K gold over sterling silver posts.',
    details: [
      '18K Yellow Gold electroplated brass with hollow core',
      'Hypoallergenic surgical steel posts with secure click-lock closure',
      'Diameter: 28mm; Thickness: 6mm',
      'Featherlight: only 4.5g per earring',
    ],
    fabric: '18K Gold Dipped with Surgical Steel Posts',
    care: 'Clean with gentle jewelry cloth. Avoid contact with chlorine or chemical cleaners.',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 22 },
    colors: [
      { name: 'Warm 18K Gold', hex: '#DFC15D' },
      { name: 'Polished Silver', hex: '#D6D7DC' },
    ],
    tags: ['Hoops', 'Gold Jewelry', 'Everyday Luxury', 'Bestseller'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 95,
    createdAt: new Date('2026-08-14').toISOString(),
  },
  {
    id: 'vnz-403',
    name: 'Cassia Cascading Crystal Chandelier Drops',
    subtitle: 'Light-Refracting Baguette Crystals with High Brilliance',
    category: 'Earrings',
    price: 88,
    description:
      'Statement evening chandelier earrings crafted with tiered rows of baguette and teardrop cubic zirconia crystals that sway with fluid motion and dazzling light refraction.',
    details: [
      'AAAAA Grade Cubic Zirconia crystals with diamond-cut facets',
      'Rhodium plated brass prevents tarnishing and stays brilliant',
      'Length: 2.75 inches (7cm)',
      'Comfort-disc earring backs support weight evenly',
    ],
    fabric: 'Cubic Zirconia & Rhodium Plated Brass',
    care: 'Keep in soft velvet pouch. Wipe with dry microfiber cloth.',
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 11 },
    colors: [
      { name: 'Pure Diamond Sparkle', hex: '#F0F4F8' },
    ],
    tags: ['Chandelier', 'Crystals', 'Evening Gala', 'Bridal'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    rating: 5.0,
    reviewsCount: 16,
    createdAt: new Date('2026-08-26').toISOString(),
  },
  {
    id: 'vnz-404',
    name: 'Solstice Hammered 18K Gold Coin Studs',
    subtitle: 'Organic Textured Coin Disc with Sterling Silver Posts',
    category: 'Earrings',
    price: 44,
    description:
      'Artisan disc stud earrings featuring an organic hammered surface that catches sunlight naturally. Crafted from recycled brass dipped in 18-karat gold with titanium hypoallergenic posts.',
    details: [
      'Organic hammered molten disc silhouette',
      '18-Karat gold plated over eco-friendly recycled brass',
      'Diameter: 16mm',
      'Titanium hypoallergenic earring posts and butterfly clutches',
    ],
    fabric: '18K Gold Plated Brass & Titanium Posts',
    care: 'Keep dry and store in jewelry pouch.',
    images: [
      'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 25 },
    colors: [
      { name: 'Brushed 18K Gold', hex: '#DFC15D' },
    ],
    tags: ['Coin Studs', 'Organic Gold', 'Minimalist'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 52,
    createdAt: new Date('2026-07-30').toISOString(),
  },
  {
    id: 'vnz-405',
    name: 'Verona Emerald & Freshwater Pearl Huggies',
    subtitle: 'Emerald Nano-Crystals with Detachable Drop Pearls',
    category: 'Earrings',
    price: 58,
    description:
      'Versatile 2-in-1 huggie earrings set with pavé emerald green nano-gemstones and detachable baroque mini pearl drops. Wear as simple sparkling hoops or full drops.',
    details: [
      'Pavé synthetic emerald nano-crystals',
      'Detachable genuine cultured mini drop pearls',
      '18K Gold vermeil huggie clasp (12mm diameter)',
      'Wear 2 ways: minimalist emerald hoop or pearl drop',
    ],
    fabric: 'Emerald Nano-Gems, Cultured Pearls & 18K Gold Vermeil',
    care: 'Wipe with soft jewelry cloth. Detach pearls before sleeping or swimming.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 18 },
    colors: [
      { name: 'Emerald & Gold Vermeil', hex: '#1C3B2B' },
    ],
    tags: ['Huggies', 'Emerald', 'Detachable Pearl', 'New Arrival'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 27,
    createdAt: new Date('2026-08-31').toISOString(),
  },

  // --- 5. NECKLACES ---
  {
    id: 'vnz-501',
    name: 'Aura Layered Gold Coin Pendant Necklace',
    subtitle: '18K Gold Dipped Dual Chain with Ancient Roman Medallion',
    category: 'Necklaces',
    price: 68,
    compareAtPrice: 82,
    description:
      'A graceful double-strand necklace featuring a delicate paperclip chain paired with an artisan embossed Roman coin pendant dipped in 18-karat gold over 925 sterling silver.',
    details: [
      '18K Yellow Gold vermeil over 925 sterling silver',
      'Dual chain length: 16" and 18" with 2" extender',
      'Lobster claw clasp closure with logo charm',
      'Hypoallergenic, nickel-free and lead-free',
    ],
    fabric: '18K Gold Vermeil over Sterling Silver',
    care: 'Keep in velvet pouch. Avoid exposure to chlorine and abrasive cleaners.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 22 },
    colors: [{ name: '18K Yellow Gold', hex: '#DFC15D' }],
    tags: ['Necklace', 'Gold', 'Layered', 'Bestseller'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 48,
    createdAt: new Date('2026-08-16').toISOString(),
  },
  {
    id: 'vnz-502',
    name: 'Lumina Teardrop Solitaire Crystal Pendant',
    subtitle: 'Brilliant Diamond-Cut Crystal on Dainty Cable Chain',
    category: 'Necklaces',
    price: 78,
    compareAtPrice: 95,
    description:
      'A timeless solitaire teardrop crystal suspended from an ultra-delicate 14-karat gold filled cable chain. Designed to sit elegantly at the collarbone.',
    details: [
      'Prong-set AAAAA faceted cubic zirconia teardrop (10x7mm)',
      '14K Gold-Filled chain resistant to tarnishing',
      'Adjustable 15" - 17" length',
      'Packaged in signature Vino’z jewelry gift box',
    ],
    fabric: 'Cubic Zirconia & 14K Gold-Filled Brass',
    care: 'Gently buff with lint-free microfiber cloth.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 18 },
    colors: [{ name: 'Crystal & Warm Gold', hex: '#EBE2D5' }],
    tags: ['Necklace', 'Crystal', 'Solitaire', 'Bridal'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 39,
    createdAt: new Date('2026-08-27').toISOString(),
  },

  // --- 6. RINGS ---
  {
    id: 'vnz-601',
    name: 'Eternity Pavé Baguette Diamond Band',
    subtitle: 'Micro-Pavé Faceted Stones in Sterling Silver',
    category: 'Rings',
    price: 72,
    compareAtPrice: 88,
    description:
      'A continuous band of hand-set sparkling baguette and round cubic zirconia stones that radiate brilliance from every angle. Ideal for stacking or wearing as an understated focal ring.',
    details: [
      'Channel and prong-set AAAAA Austrian crystals',
      'Solid 925 Sterling Silver plated in high-luster rhodium',
      'Comfort-fit inner band profile',
      'Band width: 3.2mm',
    ],
    fabric: '925 Sterling Silver & Pavé Zirconia',
    care: 'Avoid wearing during swimming or strenuous exercise.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 6, S: 10, M: 8, L: 4, XL: 0, 'One Size': 0 },
    colors: [
      { name: 'Platinum Silver', hex: '#E5E7EB' },
      { name: 'Warm Gold', hex: '#DECBA4' },
    ],
    tags: ['Ring', 'Eternity Band', 'Sparkle', 'Bestseller'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 65,
    createdAt: new Date('2026-08-08').toISOString(),
  },
  {
    id: 'vnz-602',
    name: 'Solstice Molten 18K Gold Signet Ring',
    subtitle: 'Sculptural Organic Molten Profile in 18K Gold Dipped Brass',
    category: 'Rings',
    price: 64,
    compareAtPrice: 75,
    description:
      'Inspired by fluid metalwork, this statement signet ring features an undulating organic flat face with gently rounded shoulders that sit flush on the finger.',
    details: [
      'Heavyweight recycled brass dipped in 2.5 microns of 18K gold',
      'Hand-buffed mirror finish with organic molten texture',
      'Smooth tapered comfort band',
    ],
    fabric: '18K Gold Dipped Recycled Brass',
    care: 'Buff gently with dry cotton cloth to preserve sheen.',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 4, S: 8, M: 7, L: 5, XL: 0, 'One Size': 0 },
    colors: [{ name: '18K Yellow Gold', hex: '#DFC15D' }],
    tags: ['Ring', 'Signet', 'Molten Gold', 'New Arrival'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 24,
    createdAt: new Date('2026-08-24').toISOString(),
  },

  // --- 7. BANGLES ---
  {
    id: 'vnz-701',
    name: 'Kundan Studded Heritage Gold Bangle Set',
    subtitle: 'Artisan Hand-Set Glass Crystals & Floral Meenakari Engraving',
    category: 'Bangles',
    price: 92,
    compareAtPrice: 115,
    description:
      'A magnificent set of two heritage bangles adorned with bezel-set kundan crystals and micro-pearl accents. Finished with traditional antique gold polish for festive and ceremonial occasions.',
    details: [
      'Authentic hand-set Kundan glass crystals',
      'Solid copper-brass alloy with 22K antique gold plating',
      'Screw-hinge pin lock accommodates easy on/off',
      'Set includes pair of 2 matching bangles',
    ],
    fabric: '22K Antique Gold Plated Alloy & Kundan Stones',
    care: 'Store in zip-lock pouch away from perfumes and hair spray.',
    images: [
      'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 5, M: 8, L: 6, XL: 0, 'One Size': 0 },
    colors: [{ name: 'Heirloom 22K Gold', hex: '#D4AF37' }],
    tags: ['Bangle', 'Heritage', 'Kundan', 'Festive', 'Bestseller'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 78,
    createdAt: new Date('2026-08-02').toISOString(),
  },
  {
    id: 'vnz-702',
    name: 'Aurelia Minimalist Sculpted Torc Bangle',
    subtitle: 'Open Cuff in High-Polish 18K Gold Vermeil',
    category: 'Bangles',
    price: 58,
    compareAtPrice: 70,
    description:
      'A sleek, open-ended minimalist torc cuff with smooth rounded finials. Slightly flexible to conform comfortably to any wrist size.',
    details: [
      '18K Yellow Gold plated over hypoallergenic stainless core',
      'Open cuff design allows custom tension adjustment',
      'Water-resistant and tarnish-proof finish',
    ],
    fabric: '18K Gold Vermeil over Stainless Core',
    care: 'Wipe with soft cloth. Suitable for daily wear.',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 20 },
    colors: [{ name: 'Polished 18K Gold', hex: '#DFC15D' }],
    tags: ['Bangle', 'Cuff', 'Minimalist', 'Everyday'],
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 31,
    createdAt: new Date('2026-08-20').toISOString(),
  },

  // --- 8. CHAINS ---
  {
    id: 'vnz-801',
    name: 'Emerald Crystal Pendant Figaro Chain',
    subtitle: 'Deep Forest Emerald Cut Crystal on 18K Figaro Links',
    category: 'Chains',
    price: 62,
    compareAtPrice: 75,
    description:
      'A statement emerald-cut bottle green crystal suspended from a 3mm diamond-cut Italian Figaro link chain in rich yellow gold. Brings vintage European charm to any neckline.',
    details: [
      'Faceted emerald nano-gemstone crystal (14x10mm)',
      'Italian Figaro pattern link chain (3mm width)',
      '18K Gold PVD coating that never fades or stains skin',
      'Length: 18 inches with 2-inch extender',
    ],
    fabric: '18K Gold PVD on Stainless Steel & Emerald Crystal',
    care: 'Waterproof and sweatproof. Wipe clean with cloth.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 18 },
    colors: [{ name: 'Emerald & Gold', hex: '#1C3B2B' }],
    tags: ['Chains', 'Emerald', 'Figaro', 'Vintage', 'Bestseller'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 42,
    createdAt: new Date('2026-08-15').toISOString(),
  },
  {
    id: 'vnz-802',
    name: 'Liquid Gold Flat Snake Bone Collar Chain',
    subtitle: 'Silky Fluid Herringbone Snake Chain in 18K Gold',
    category: 'Chains',
    price: 54,
    compareAtPrice: 65,
    description:
      'Engineered with tightly interlocked flat herringbone links that drape like molten liquid gold around the neck. Features an ultra-reflective high-mirror finish.',
    details: [
      'Flat 4mm herringbone snake chain weave',
      'Heavy 18K gold electroplate over hypoallergenic brass',
      'Secure lobster clasp with 2-inch tail extension',
      'Lays completely flat without kinking or pinching',
    ],
    fabric: '18K Gold Electroplate Brass',
    care: 'Store flat in jewelry case to prevent sharp bending.',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 25 },
    colors: [{ name: 'Liquid 18K Gold', hex: '#DFC15D' }],
    tags: ['Chains', 'Herringbone', 'Snake Chain', 'Collar'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 56,
    createdAt: new Date('2026-07-28').toISOString(),
  },

  // --- 9. BRACELETS ---
  {
    id: 'vnz-901',
    name: 'Sparkling Crystal Riviera Tennis Bracelet',
    subtitle: 'Continuous 3mm Round Cubic Zirconia in 4-Prong Settings',
    category: 'Bracelets',
    price: 79,
    compareAtPrice: 95,
    description:
      'The quintessential luxury tennis bracelet. Featuring an unbroken line of 3mm round brilliant cubic zirconia crystals set in 4-prong rhodium plated baskets with a double safety clasp.',
    details: [
      'Continuous line of AAAAA round brilliant crystals',
      'Rhodium plated 925 sterling silver base',
      'Dual fold-over safety latch closure',
      'Length: 7 inches (18cm)',
    ],
    fabric: 'Cubic Zirconia & Rhodium Plated Sterling Silver',
    care: 'Clean with warm soapy water and soft brush. Dry thoroughly.',
    images: [
      'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 22 },
    colors: [
      { name: 'Pure Diamond Sparkle', hex: '#F0F4F8' },
      { name: 'Warm Champagne Gold', hex: '#DECBA4' },
    ],
    tags: ['Bracelets', 'Tennis Bracelet', 'Crystal', 'Bridal', 'Bestseller'],
    isNewArrival: true,
    isBestSeller: true,
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 68,
    createdAt: new Date('2026-08-11').toISOString(),
  },
  {
    id: 'vnz-902',
    name: 'Baroque Pearl & Gold Toggle Link Bracelet',
    subtitle: 'Hand-Knotted Organic Pearls with Chunky Paperclip Links',
    category: 'Bracelets',
    price: 68,
    compareAtPrice: 82,
    description:
      'Half chunky paperclip links and half genuine baroque freshwater pearls, joined with an artisan T-bar toggle clasp in 18-karat gold vermeil.',
    details: [
      'Grade-AA genuine freshwater baroque pearls (9-11mm)',
      '18K Gold vermeil paperclip chain and toggle clasp',
      'Length: 7.25 inches',
      'Unique organic pearl textures for every piece',
    ],
    fabric: 'Freshwater Baroque Pearls & 18K Gold Vermeil',
    care: 'Put on after perfumes and beauty products.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1611591475152-47702844e1d5?auto=format&fit=crop&w=1200&q=85',
    ],
    featuredImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    sizes: { XS: 0, S: 0, M: 0, L: 0, XL: 0, 'One Size': 16 },
    colors: [{ name: 'Pearl & 18K Gold', hex: '#F5EFEB' }],
    tags: ['Bracelets', 'Pearl', 'Toggle', 'Paperclip Chain'],
    isNewArrival: false,
    isBestSeller: true,
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 44,
    createdAt: new Date('2026-08-07').toISOString(),
  },
];

// Initial Users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Vino’z Chief Administrator',
    email: 'admin@vinoz.com',
    role: 'admin',
    token: 'admin-vinoz-token-secure-99',
    phone: '+1 (555) 839-2041',
    address: '740 Madison Avenue',
    city: 'New York, NY',
    createdAt: new Date('2026-01-01').toISOString(),
  },
];

// Initial Demo Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'VNZ-2026-8910',
    customer: {
      fullName: 'Sophia Laurent',
      email: 'sophia@example.com',
      phone: '+1 (555) 234-5678',
      address: '420 Park Avenue S, Apt 8B',
      city: 'New York',
      state: 'NY',
      postalCode: '10016',
      country: 'United States',
    },
    items: [
      {
        productId: 'vnz-101',
        name: 'The Bordeaux Silk Slip Dress',
        size: 'S',
        color: 'Vino Burgundy',
        quantity: 1,
        unitPrice: 185,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'vnz-201',
        name: 'French Tortoise Acetate Claw Clip',
        size: 'One Size',
        color: 'Amber Tortoise',
        quantity: 1,
        unitPrice: 28,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 213,
    shippingFee: 0,
    discount: 32,
    promoCode: 'VINOZ15',
    total: 181,
    status: 'Shipped',
    paymentMethod: 'credit_card',
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    trackingNumber: '1Z9999999999999999',
  },
  {
    id: 'VNZ-2026-8902',
    customer: {
      fullName: 'Camille Dubois',
      email: 'camille@vogueparis.fr',
      phone: '+33 6 12 34 56 78',
      address: '18 Rue de Rivoli',
      city: 'Paris',
      state: 'Île-de-France',
      postalCode: '75004',
      country: 'France',
    },
    items: [
      {
        productId: 'vnz-301',
        name: 'Duchess Padded Silk Satin Headband',
        size: 'One Size',
        color: 'Vino Bordeaux',
        quantity: 1,
        unitPrice: 45,
        image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'vnz-401',
        name: 'Baroque Keshi Pearl Drop Earrings',
        size: 'One Size',
        color: 'Lustrous Pearl & Gold',
        quantity: 1,
        unitPrice: 78,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 123,
    shippingFee: 0,
    discount: 0,
    total: 123,
    status: 'Processing',
    paymentMethod: 'credit_card',
    paymentStatus: 'Paid',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
];

class VinozDatabase {
  private db: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.db = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      meta: {
        lastUpdated: new Date().toISOString(),
        version: '2.1.0',
      },
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && Array.isArray(parsed.products) && parsed.meta?.version === '2.1.0') {
          this.db = parsed;
          this.isLoaded = true;
          return;
        }
      }

      // First time save or version migration
      this.saveToDisk();
      this.isLoaded = true;
    } catch (err) {
      console.error('Error initializing VinozDatabase from disk:', err);
      this.isLoaded = true;
    }
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      this.db.meta.lastUpdated = new Date().toISOString();
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error writing database to disk:', err);
    }
  }

  // --- Products ---
  public getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    inStockOnly?: boolean;
    sort?: string;
  }): Product[] {
    let result = [...this.db.products];

    if (params?.category && params.category !== 'All') {
      result = result.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.size) {
      const s = params.size as ProductSize;
      result = result.filter((p) => (p.sizes[s] || 0) > 0);
    }

    if (params?.inStockOnly) {
      result = result.filter((p) => Object.values(p.sizes).some((count) => count > 0));
    }

    // Sorting
    switch (params?.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.reviewsCount - a.reviewsCount;
        });
        break;
    }

    return result;
  }

  public getProductById(id: string): Product | null {
    return this.db.products.find((p) => p.id === id) || null;
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `vnz-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    this.db.products.unshift(newProduct);
    this.saveToDisk();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.db.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.db.products[index] = {
      ...this.db.products[index],
      ...updates,
      id, // protect immutable id
    };
    this.saveToDisk();
    return this.db.products[index];
  }

  public deleteProduct(id: string): boolean {
    const beforeCount = this.db.products.length;
    this.db.products = this.db.products.filter((p) => p.id !== id);
    const deleted = this.db.products.length < beforeCount;
    if (deleted) this.saveToDisk();
    return deleted;
  }

  // --- Orders & Inventory Deduction ---
  public getOrders(userId?: string, isAdmin?: boolean): Order[] {
    if (isAdmin) {
      return [...this.db.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    if (userId) {
      return this.db.orders
        .filter((o) => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...this.db.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | null {
    return this.db.orders.find((o) => o.id === id) || null;
  }

  public createOrder(orderPayload: Omit<Order, 'id' | 'createdAt' | 'status' | 'paymentStatus'>): {
    success: boolean;
    order?: Order;
    error?: string;
  } {
    // 1. Inventory validation
    for (const item of orderPayload.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        return { success: false, error: `Product '${item.name}' is no longer available.` };
      }
      const available = product.sizes[item.size] || 0;
      if (available < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for '${item.name}' in size ${item.size} (Only ${available} remaining).`,
        };
      }
    }

    // 2. Deduct inventory atomically
    for (const item of orderPayload.items) {
      const product = this.getProductById(item.productId)!;
      product.sizes[item.size] = Math.max(0, (product.sizes[item.size] || 0) - item.quantity);
    }

    // 3. Create unique Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderPayload,
      id: `VNZ-2026-${randomSuffix}`,
      status: 'Processing',
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'Pending' : 'Paid',
      createdAt: new Date().toISOString(),
    };

    this.db.orders.unshift(newOrder);
    this.saveToDisk();
    return { success: true, order: newOrder };
  }

  public updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string): Order | null {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.status = status;
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    this.saveToDisk();
    return order;
  }

  // --- Users & Authentication ---
  public findUserByEmail(email: string): User | null {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public getUserById(id: string): User | null {
    return this.db.users.find((u) => u.id === id) || null;
  }

  public getUserByToken(token: string): User | null {
    return this.db.users.find((u) => u.token === token) || null;
  }

  public createUser(userData: { name: string; email: string; role?: 'admin' | 'customer'; phone?: string }): User {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role || 'customer',
      token: `vnz-auth-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
    };
    this.db.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  // --- Admin Analytics & Stats ---
  public getAdminStats(): AdminStats {
    const totalRevenue = this.db.orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = this.db.orders.length;
    const totalProducts = this.db.products.length;

    let lowStockCount = 0;
    for (const p of this.db.products) {
      const totalInventory = Object.values(p.sizes).reduce((acc, count) => acc + count, 0);
      if (totalInventory <= 8) {
        lowStockCount++;
      }
    }

    const recentOrders = [...this.db.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      recentOrders,
    };
  }

  // Reset demo catalogue
  public resetToDemo(): void {
    this.db = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      users: INITIAL_USERS,
      meta: {
        lastUpdated: new Date().toISOString(),
        version: '2.0.0',
      },
    };
    this.saveToDisk();
  }
}

export const db = new VinozDatabase();
