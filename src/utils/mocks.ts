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

export const MOCKED_PRODUCTS: Product[] = [
    {
        id: '1',
        brand: 'YUNNAN SOURCE',
        name: 'Raw Pu-erh Cake 2015',
        slug: 'raw-puerh-cake-2015',
        shortDescription: '<strong>Fresh, floral and evolving.</strong> A young sheng Pu-erh with bright vegetal notes and a lingering sweetness.',
        description: `
    <h3>Authentic Yunnan origin</h3>
    <p>Harvested from ancient tea trees in Yunnan, this <strong>2015 raw Pu-erh</strong> offers a vibrant and evolving profile.</p>
    <h3>Tasting notes</h3>
    <ul>
      <li>Floral aroma</li>
      <li>Green apple acidity</li>
      <li>Light astringency</li>
    </ul>
    <h3>Brewing guide</h3>
    <p>Use 5g per 100ml at 90–95°C. Rinse once and steep multiple infusions.</p>
    <h3>Aging potential</h3>
    <p>Can be aged for decades, developing deeper complexity over time.</p>
    `,
        price: 42.5,
        salePrice: null,
        stockStatus: 'IN_STOCK',
        images: [
            'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&q=80',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
        ],
        thumbnails: [
            'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=120&q=60',
            'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=120&q=60',
        ],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Pu-erh', 'Raw', 'Sheng', 'Yunnan'],
    },
    {
        id: '2',
        brand: 'MENGHAI TEA FACTORY',
        name: 'Ripe Pu-erh Cake 2012',
        slug: 'ripe-puerh-cake-2012',
        shortDescription: '<strong>Smooth and earthy.</strong> A classic shu Pu-erh with deep, woody richness and mellow sweetness.',
        description: `
    <h3>Traditional fermentation</h3>
    <p>This <strong>2012 ripe Pu-erh</strong> undergoes controlled fermentation for a smooth, rich taste.</p>
    <h3>Tasting notes</h3>
    <ul>
      <li>Earthy body</li>
      <li>Dark chocolate hints</li>
      <li>Silky mouthfeel</li>
    </ul>
    <h3>Brewing guide</h3>
    <p>Use boiling water (100°C), steep 10–20 seconds for multiple infusions.</p>
    `,
        price: 36.9,
        salePrice: 29.9,
        stockStatus: 'IN_STOCK',
        images: [
            'https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=800&q=80',
        ],
        thumbnails: [
            'https://images.unsplash.com/photo-1544785349-c4a5301826fd?w=120&q=60',
        ],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Pu-erh', 'Ripe', 'Shu', 'Fermented'],
    },
    {
        id: '3',
        brand: 'XIAGUAN',
        name: 'Tuocha Pu-erh 2018',
        slug: 'tuocha-puerh-2018',
        shortDescription: '<strong>Compact and bold.</strong> A classic tuocha shape with smoky undertones and robust flavor.',
        description: `
    <h3>Traditional tuocha form</h3>
    <p>Pressed into a bird’s nest shape, this tea delivers bold and concentrated infusions.</p>
    <h3>Tasting notes</h3>
    <ul>
      <li>Smoky aroma</li>
      <li>Herbal depth</li>
      <li>Long finish</li>
    </ul>
    `,
        price: 18.5,
        salePrice: null,
        stockStatus: 'IN_STOCK',
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80'],
        thumbnails: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&q=60'],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Pu-erh', 'Tuocha', 'Compressed'],
    },
    {
        id: '4',
        brand: 'LAO BAN ZHANG',
        name: 'Ancient Tree Sheng Pu-erh',
        slug: 'ancient-tree-sheng-puerh',
        shortDescription: '<strong>Rare and powerful.</strong> Premium leaves from ancient trees with intense complexity.',
        description: `
    <h3>Ancient tree harvest</h3>
    <p>Sourced from centuries-old tea trees, delivering unmatched depth and energy.</p>
    <h3>Tasting notes</h3>
    <ul>
      <li>Honey sweetness</li>
      <li>Bittersweet balance</li>
      <li>Lingering huigan</li>
    </ul>
    `,
        price: 120,
        salePrice: null,
        stockStatus: 'OUT_OF_STOCK',
        images: ['https://images.unsplash.com/photo-1527169402691-a1b58d0c1d4a?w=800&q=80'],
        thumbnails: ['https://images.unsplash.com/photo-1527169402691-a1b58d0c1d4a?w=120&q=60'],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Premium', 'Ancient Tree', 'Sheng'],
    },
    {
        id: '5',
        brand: 'DAYI',
        name: 'Golden Needle White Lotus',
        slug: 'golden-needle-white-lotus',
        shortDescription: '<strong>Refined and smooth.</strong> A luxurious ripe Pu-erh blend with golden buds.',
        description: `
    <h3>Signature blend</h3>
    <p>Combines fine leaves and golden tips for a balanced, elegant cup.</p>
    <h3>Tasting notes</h3>
    <ul>
      <li>Sweet earth</li>
      <li>Velvety texture</li>
      <li>Subtle floral finish</li>
    </ul>
    `,
        price: 54.2,
        salePrice: 47.5,
        stockStatus: 'IN_STOCK',
        images: ['https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=800&q=80'],
        thumbnails: ['https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=120&q=60'],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Ripe', 'Luxury', 'Blend'],
    },
    {
        id: '6',
        brand: 'YUNNAN CRAFT',
        name: 'Loose Leaf Sheng Pu-erh',
        slug: 'loose-leaf-sheng-puerh',
        shortDescription: '<strong>Bright and accessible.</strong> Loose-leaf raw Pu-erh for everyday enjoyment.',
        description: `
    <h3>Loose leaf convenience</h3>
    <p>No need to break cakes — easy brewing with full flavor.</p>
    <h3>Tasting notes</h3>
    <ul>
      <li>Citrus zest</li>
      <li>Fresh grass</li>
      <li>Clean finish</li>
    </ul>
    `,
        price: 22,
        salePrice: null,
        stockStatus: 'IN_STOCK',
        images: ['https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80'],
        thumbnails: ['https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=120&q=60'],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Loose Leaf', 'Sheng'],
    },
    {
        id: '7',
        brand: 'TEA MOUNTAIN',
        name: 'Mini Pu-erh Tuocha Set',
        slug: 'mini-puerh-tuocha-set',
        shortDescription: '<strong>Convenient and portable.</strong> Individually wrapped mini tuocha portions.',
        description: `
    <h3>Perfect for travel</h3>
    <p>Each mini tuocha is pre-portioned for a single session.</p>
    <h3>Flavor profile</h3>
    <ul>
      <li>Mild earthiness</li>
      <li>Smooth body</li>
      <li>Easy-drinking</li>
    </ul>
    `,
        price: 15.9,
        salePrice: 12.9,
        stockStatus: 'IN_STOCK',
        images: ['https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=800&q=80'],
        thumbnails: ['https://images.unsplash.com/photo-1507914372368-b2b085b925a1?w=120&q=60'],
        category: { name: 'Pu-erh Tea', slug: 'puerh-tea' },
        tags: ['Mini', 'Tuocha', 'Portable'],
    },
];