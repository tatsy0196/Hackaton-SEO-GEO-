export interface Vendor {
    id: string;
    slug: string;
    name: string;
    bioCertification: string;
    bioCertifDate: Date;
    shortDescription: string;
    seoDescription?: string;
    address: string;
    postalCode: string;
    city: string;
    labels: string[];
    imageUrl: string;
    products: Product[];
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    labels?: string[];
    price: number;
    discountPrice?: number;
    vendorId: string;
    category: string;
    city: string;
    shortDescription: string;
    imageUrl: string;
    images: string[];
    longDescription: string;
    weight: string;
    origin: string;
    composition: string;
    conservation: string;
    nutritionalInfo: string;
    certifications: string[];
    stock: number;
}

// Données mock
const vendors: Vendor[] = [
    {
        id: 'v1',
        bioCertification: "acquis",
        bioCertifDate:  new Date(2024,6,22) ,
        slug: 'ferme-des-batignolles',
        name: 'Ferme des Batignolles',
        shortDescription: 'Maraîcher bio livrant des paniers de saison sur Grenoble.',
        seoDescription: 'Producteur local bio proposant des paniers de légumes de saison en circuit court à Grenoble.',
        address: '12 rue des Moines',
        postalCode: '38001',
        city: 'Grenoble',
        labels: ['Bio', 'Circuit court'],
        imageUrl: 'https://ametzalde.fr/wp-content/uploads/2022/10/ferme-ametzalde-bio-pays-basque.jpg',
        products: []
    },
    {
        id: 'v2',
        bioCertification: "acquis",
        bioCertifDate:  new Date(2022,8,16) ,
        slug: 'epicerie-vrac-du-centre',
        name: 'Épicerie Vrac du centre',
        shortDescription: 'Épicerie en vrac et zéro déchet en pleins coeur de Grenoble.',
        address: '15 cours de la liberation',
        postalCode: '38000',
        city: 'Grenoble',
        labels: ['Zéro déchet', 'Vrac'],
        imageUrl: 'https://www.seinemaritime.fr/images/large/0809-sia-philippe-savale-la-ferme-du-vieux-puits03.webp',
        products: []
    }
]

const products: Product[] = [
    {
        id: 'p1',
        slug: 'panier-legumes-bio-Grenoble',
        name: 'Panier de légumes bio de saison',
        price: 24.9,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Grenoble',
        shortDescription: 'Un panier surprise de légumes bio de saison pour 2 à 3 personnes.',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=350&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop'
        ],
        longDescription: 'Notre panier de légumes bio est composé de produits frais récoltés le jour même dans nos fermes partenaires. Chaque semaine, découvrez une sélection variée de légumes de saison cultivés sans pesticides ni engrais chimiques. Idéal pour 2 à 3 personnes, ce panier vous garantit saveur et fraîcheur.',
        weight: '4-5 kg',
        origin: 'Île-de-France',
        composition: 'Tomates, carottes, courgettes, salades, pommes de terre, oignons (selon disponibilité saisonnière)',
        conservation: 'À conserver au frais, consommer dans les 7 jours',
        nutritionalInfo: 'Riche en vitamines, minéraux et fibres',
        certifications: ['Bio AB', 'Agriculture Biologique Européenne'],
        stock: 15
    },
    {
        id: 'p2',
        slug: 'cereales-vrac-bio',
        name: 'Céréales en vrac bio',
        price: 8.5,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Grenoble',
        shortDescription: 'Avoine, riz complet, quinoa bio en vrac.',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=350&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop'
        ],
        longDescription: 'Nos céréales bio sont sélectionnées avec soin auprès de producteurs certifiés. Vendues en vrac, elles vous permettent de réduire les emballages tout en profitant de produits de qualité supérieure. Parfaites pour un petit-déjeuner sain ou des préparations culinaires variées.',
        weight: 'Au choix (vendu au kg)',
        origin: 'France',
        composition: 'Mélange d\'avoine, riz complet et quinoa biologiques',
        conservation: 'À conserver dans un endroit sec, à l\'abri de la lumière',
        nutritionalInfo: 'Source de protéines végétales, fibres et magnésium',
        certifications: ['Bio AB'],
        stock: 50
    },
    {
        id: 'p4',
        slug: 'pain-complet-bio',
        name: 'Pain complet bio au levain',
        price: 4.2,
        vendorId: 'v2',
        category: 'Boulangerie',
        city: 'Grenoble',
        shortDescription: 'Pain au levain naturel, farine bio française.',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=350&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=800&h=600&fit=crop',
        ],
        longDescription: 'Pain complet bio au levain naturel, pétri à la main et cuit au four traditionnel. Notre boulanger utilise uniquement de la farine bio française et un levain actif depuis plus de 20 ans. La fermentation lente permet d\'obtenir une mie aérée et une croûte croustillante.',
        weight: '500g',
        origin: 'France',
        composition: 'Farine complète bio T150, eau, levain naturel, sel',
        conservation: 'À conserver à température ambiante, consommer dans les 3-4 jours',
        nutritionalInfo: 'Riche en fibres et minéraux',
        certifications: ['Bio AB'],
        stock: 25
    },
    {
        id: 'p5',
        slug: 'fromage-chevre-fermier',
        name: 'Fromage de chèvre fermier',
        price: 6.8,
        vendorId: 'v1',
        category: 'Produits laitiers',
        city: 'Grenoble',
        shortDescription: 'Fromage de chèvre frais, production locale.',
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&h=350&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=800&h=600&fit=crop',
           
        ],
        longDescription: 'Fromage de chèvre fermier à pâte fraîche, élaboré avec du lait cru de nos chèvres élevées en plein air. Texture onctueuse et saveur délicate, parfait pour les tartines ou en salade.',
        weight: '150g',
        origin: 'Île-de-France',
        composition: 'Lait cru de chèvre, ferments lactiques, sel',
        conservation: 'À conserver entre 2 et 6°C, consommer dans les 10 jours',
        nutritionalInfo: 'Source de calcium et protéines',
        certifications: ['Fermier'],
        stock: 18
    },
    {
        id: 'p19',
        slug: 'carottes-bio-botte',
        name: 'Carottes bio en botte',
        price: 2.9,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Grenoble',
        shortDescription: 'Botte de carottes fraîches bio avec fanes, environ 500g.',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=350&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1522184216316-3c25379f9760?w=800&h=600&fit=crop'
        ],
        longDescription: 'Carottes bio fraîchement récoltées avec leurs fanes. Croquantes et sucrées, parfaites crues ou cuites. Les fanes peuvent être utilisées en soupe ou pesto.',
        weight: '500g',
        origin: 'Île-de-France',
        composition: 'Carottes bio avec fanes',
        conservation: 'À conserver au frais, consommer dans les 5 jours',
        nutritionalInfo: 'Riche en bêta-carotène et fibres',
        certifications: ['Bio AB'],
        stock: 27
    }
]

export const getVendors = async (): Promise<Vendor[]> => vendors
export const getVendorBySlug = async (slug: string): Promise<Vendor | null> =>
    vendors.find(v => v.slug === slug) ?? null

export const getProducts = async (): Promise<Product[]> => products
export const getProductBySlug = async (slug: string): Promise<Product | null> =>
    products.find(p => p.slug === slug) ?? null

export const getProductsByArrondissement = async (): Promise<Product[]> =>
    products.filter(p => p.city === 'Grenoble') // Simule un filtre par arrondissement

// Récupérer le vendeur d'un produit
export const getVendorForProduct = async (vendorId: string): Promise<Vendor | null> =>
    vendors.find(v => v.id === vendorId) ?? null

// Récupérer tous les produits d'un vendeur
export const getProductsByVendor = async (vendorId: string): Promise<Product[]> =>
    products.filter(p => p.vendorId === vendorId)
