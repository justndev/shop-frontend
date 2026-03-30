import {Product} from "@/src/types";

export const MOCKED_PRODUCT: Product = {
    id: '1',
    brand: 'MAMA KANA',
    name: 'Vape Pen CBD Amnesia',
    slug: 'vape-pen-cbd-amnesia',
    shortDescription: '<strong>A powerful, lemony, earthy flavor.</strong> Known for its invigorating effect, <em>Amnesia</em> seduces with its deep aromas of citrus, incense and wood.',
    description: `
    <h3>Exceptional cannabinoid concentration</h3>
    <p>Each pod contains <strong>95% CBD</strong> extract for up to 300 puffs of smooth, consistent vapor. No PG, no VG — just pure broad-spectrum hemp extract.</p>
    <h3>What's in the box</h3>
    <ul>
      <li>1× rechargeable vape pen battery (USB-C)</li>
      <li>1× pre-filled Amnesia CBD pod (1 ml / 95% CBD)</li>
      <li>1× USB-C charging cable</li>
    </ul>
    <h3>How to use</h3>
    <p>Simply attach the pod, inhale gently, and enjoy. No buttons, no settings. The draw-activated mechanism fires instantly for a fuss-free experience anywhere.</p>
    <h3>Lab-tested quality</h3>
    <p>Every batch is independently tested for cannabinoid potency, residual solvents, pesticides, and heavy metals. Certificates of Analysis available on request.</p>
    <h3>Delivery &amp; returns 📦</h3>
    <p>All packages are neutral for fast, discreet CBD delivery. Minimum order 20 €. Free delivery from 49 € of purchase. You have 15 days to change your mind — unopened packages only.</p>
  `,
    price: 30.38,
    salePrice: null as number | null,
    stockStatus: 'IN_STOCK' as 'IN_STOCK' | 'OUT_OF_STOCK',
    images: [
        'https://images.unsplash.com/photo-1621527284559-bb1e1f22e83f?w=800&q=80',
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&q=80',
        'https://images.unsplash.com/photo-1574856344991-aaa31b6f4b9e?w=800&q=80',
    ],
    thumbnails: [
        'https://images.unsplash.com/photo-1621527284559-bb1e1f22e83f?w=120&q=60',
        'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=120&q=60',
        'https://images.unsplash.com/photo-1574856344991-aaa31b6f4b9e?w=120&q=60',
    ],
    category: { name: 'Vape Pens', slug: 'vape-pens' },
    tags: ['CBD', 'Amnesia', 'Vape', 'Broad-spectrum'],
};