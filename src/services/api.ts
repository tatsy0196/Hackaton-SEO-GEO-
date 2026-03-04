// Données mock
const vendors = [
    {
        id: 'v1',
        slug: 'ferme-des-batignolles',
        name: 'Ferme des Batignolles',
        shortDescription: 'Maraîcher bio livrant des paniers de saison sur Paris.',
        seoDescription: 'Producteur local bio proposant des paniers de légumes de saison en circuit court à Paris.',
        address: '12 rue des Moines',
        postalCode: '75017',
        city: 'Paris',
        labels: ['Bio', 'Circuit court'],
        imageUrl: 'https://via.placeholder.com/400x260/90ee90/ffffff?text=Batignolles',
        products: []
    },
    {
        id: 'v2',
        slug: 'epicerie-vrac-11eme',
        name: 'Épicerie Vrac 11ème',
        shortDescription: 'Épicerie en vrac et zéro déchet dans le 11ème.',
        address: '45 rue Oberkampf',
        postalCode: '75011',
        city: 'Paris',
        labels: ['Zéro déchet', 'Vrac'],
        imageUrl: 'https://via.placeholder.com/400x260/a8e6cf/ffffff?text=Vrac+11',
        products: []
    }
]

const products = [
    {
        id: 'p1',
        slug: 'panier-legumes-bio-paris',
        name: 'Panier de légumes bio de saison',
        price: 24.9,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Paris',
        shortDescription: 'Un panier surprise de légumes bio de saison pour 2 à 3 personnes.',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=350&fit=crop'
    },
    {
        id: 'p2',
        slug: 'cereales-vrac-bio',
        name: 'Céréales en vrac bio',
        price: 8.5,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Avoine, riz complet, quinoa bio en vrac.',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=350&fit=crop'
    },
    {
        id: 'p4',
        slug: 'pain-complet-bio',
        name: 'Pain complet bio au levain',
        price: 4.2,
        vendorId: 'v2',
        category: 'Boulangerie',
        city: 'Paris',
        shortDescription: 'Pain au levain naturel, farine bio française.',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=350&fit=crop'
    },
    {
        id: 'p5',
        slug: 'fromage-chevre-fermier',
        name: 'Fromage de chèvre fermier',
        price: 6.8,
        vendorId: 'v1',
        category: 'Produits laitiers',
        city: 'Paris',
        shortDescription: 'Fromage de chèvre frais, production locale.',
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&h=350&fit=crop'
    },
    {
        id: 'p6',
        slug: 'confitures-artisanales',
        name: 'Confitures artisanales',
        price: 7.5,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Confitures maison, fruits de saison, recettes traditionnelles.',
        imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?w=500&h=350&fit=crop'
    },
    {
        id: 'p8',
        slug: 'jus-pomme-artisanal',
        name: 'Jus de pomme artisanal',
        price: 4.9,
        vendorId: 'v2',
        category: 'Boissons',
        city: 'Paris',
        shortDescription: 'Jus de pomme 100% pur jus, sans additifs.',
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=350&fit=crop'
    },
    {
        id: 'p9',
        slug: 'herbes-aromatiques-pot',
        name: 'Herbes aromatiques en pot',
        price: 3.5,
        vendorId: 'v1',
        category: 'Jardin',
        city: 'Paris',
        shortDescription: 'Basilic, thym ou menthe, cultivés localement.',
        imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=500&h=350&fit=crop'
    },
    {
        id: 'p10',
        slug: 'tomates-cerises-bio',
        name: 'Tomates cerises bio',
        price: 5.9,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Paris',
        shortDescription: 'Tomates cerises bio gorgées de soleil, barquette de 500g.',
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500&h=350&fit=crop'
    },
    {
        id: 'p11',
        slug: 'chocolat-artisanal-noir',
        name: 'Chocolat artisanal noir 70%',
        price: 6.5,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Tablette de chocolat noir 70% cacao, fabrication artisanale.',
        imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=350&fit=crop'
    },
    {
        id: 'p12',
        slug: 'yaourt-fermier-nature',
        name: 'Yaourts fermiers nature',
        price: 4.8,
        vendorId: 'v1',
        category: 'Produits laitiers',
        city: 'Paris',
        shortDescription: 'Pot de 4 yaourts au lait entier, fabrication fermière.',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&h=350&fit=crop'
    },
    {
        id: 'p13',
        slug: 'salade-mesclun-bio',
        name: 'Mesclun bio frais',
        price: 3.2,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Paris',
        shortDescription: 'Mélange de jeunes pousses bio, sachet de 150g.',
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=350&fit=crop'
    },
    {
        id: 'p14',
        slug: 'huile-olive-extra-vierge',
        name: 'Huile d\'olive extra vierge',
        price: 15.9,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Huile d\'olive première pression à froid, bouteille 500ml.',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=350&fit=crop'
    },
    {
        id: 'p15',
        slug: 'pates-artisanales-bio',
        name: 'Pâtes artisanales bio',
        price: 5.5,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Pâtes sèches bio au blé dur, séchage lent, 500g.',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=350&fit=crop'
    },
    {
        id: 'p16',
        slug: 'pommes-bio-varietes',
        name: 'Pommes bio variétés anciennes',
        price: 4.5,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Paris',
        shortDescription: 'Assortiment de pommes bio variétés anciennes, 1kg.',
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&h=350&fit=crop'
    },
    {
        id: 'p17',
        slug: 'beurre-fermier-demi-sel',
        name: 'Beurre fermier demi-sel',
        price: 3.8,
        vendorId: 'v1',
        category: 'Produits laitiers',
        city: 'Paris',
        shortDescription: 'Beurre artisanal au lait cru, demi-sel, 250g.',
        imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&h=350&fit=crop'
    },
    {
        id: 'p18',
        slug: 'the-bio-infusions',
        name: 'Thé et infusions bio',
        price: 8.9,
        vendorId: 'v2',
        category: 'Boissons',
        city: 'Paris',
        shortDescription: 'Sélection de thés et infusions bio en vrac, 100g.',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=350&fit=crop'
    },
    {
        id: 'p19',
        slug: 'carottes-bio-botte',
        name: 'Carottes bio en botte',
        price: 2.9,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Paris',
        shortDescription: 'Botte de carottes fraîches bio avec fanes, environ 500g.',
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&h=350&fit=crop'
    },
    {
        id: 'p21',
        slug: 'saucisson-sec-fermier',
        name: 'Saucisson sec fermier',
        price: 9.5,
        vendorId: 'v1',
        category: 'Charcuterie',
        city: 'Paris',
        shortDescription: 'Saucisson sec artisanal, séchage traditionnel, 250g.',
        imageUrl: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&h=350&fit=crop'
    },
    {
        id: 'p22',
        slug: 'coulis-tomate-bio',
        name: 'Coulis de tomate bio',
        price: 4.3,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Coulis de tomate bio fait maison, bocal 500ml.',
        imageUrl: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&h=350&fit=crop'
    },
    {
        id: 'p23',
        slug: 'noix-melange-bio',
        name: 'Mélange de noix bio',
        price: 7.8,
        vendorId: 'v2',
        category: 'Épicerie',
        city: 'Paris',
        shortDescription: 'Mélange de noix, noisettes et amandes bio, sachet 300g.',
        imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500&h=350&fit=crop'
    },
    {
        id: 'p24',
        slug: 'citrouille-bio',
        name: 'Citrouille bio',
        price: 3.5,
        vendorId: 'v1',
        category: 'Fruits et légumes',
        city: 'Paris',
        shortDescription: 'Citrouille bio locale, environ 2kg.',
        imageUrl: 'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=500&h=350&fit=crop'
    }
]

export const getVendors = async () => vendors
export const getVendorBySlug = async (slug: string) =>
    vendors.find(v => v.slug === slug) ?? null

export const getProducts = async () => products
export const getProductBySlug = async (slug: string) =>
    products.find(p => p.slug === slug) ?? null

export const getProductsByArrondissement = async (arrondissement: string) =>
    products.filter(p => p.city === 'Paris') // Simule un filtre par arrondissement
