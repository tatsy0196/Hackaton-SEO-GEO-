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
        imageUrl: 'https://via.placeholder.com/400x260/90ee90/ffffff?text=Panier+Bio'
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
        imageUrl: 'https://via.placeholder.com/400x260/a8e6cf/ffffff?text=Céréales'
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
