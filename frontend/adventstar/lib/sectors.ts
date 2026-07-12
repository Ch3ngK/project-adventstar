export type CatalogImage = {
  src: string;
  alt: string;
};

export type Sector = {
  slug: string;
  sector: string;
  title: string;
  description: string;
  features: string[];
  heroImage: string;
  heroImagePosition?: string;
  images: CatalogImage[];
};

function catalogImages(folder: string, files: string[]): CatalogImage[] {
  return files.map((file) => ({
    src: encodeURI(`/${folder}/${file}`),
    alt: file.replace(/\.[^.]+$/, ""),
  }));
}

export const sectors: Sector[] = [
  {
    slug: "school-uniform-programmes",
    sector: "Education",
    title: "School uniform programmes",
    description:
      "Supply for preschools, primary schools, secondary schools, and institutions that need consistent quality across student cohorts.",
    features: [
      "Daily uniforms and PE kits",
      "Reliable repeat orders",
      "Crest embroidery and school branding",
    ],
    heroImage: "/school.png",
    heroImagePosition: "object-top",
    images: catalogImages("School uniform programmes", [
      "CHIJ St Nicholas jacket.png",
      "International school uniform.png",
    ]),
  },
  {
    slug: "corporate-uniform-collections",
    sector: "Corporate",
    title: "Corporate uniform collections",
    description:
      "Professional attire for office teams and client-facing roles where presentation and brand consistency matter.",
    features: [
      "Branding and embroidery",
      "Structured quotation support",
      "Consistent sizing across teams",
    ],
    heroImage: "/corporate.png",
    heroImagePosition: "object-top",
    images: catalogImages("corporate uniform collections", [
      "Generic blazer.png",
    ]),
  },
  {
    slug: "hospitality-and-service-wear",
    sector: "Hospitality",
    title: "Hospitality and service wear",
    description:
      "Uniforms for hotel, F&B, and service teams that balance comfort, durability, and brand alignment across every front-of-house role.",
    features: ["Custom branding", "Consistent standards", "Comfort for long shifts"],
    heroImage: "/specialty.png",
    images: catalogImages("Hospitality and service wear", [
      "jetstar uniform.png",
    ]),
  },
  {
    slug: "healthcare-and-clinical-wear",
    sector: "Healthcare",
    title: "Healthcare and clinical wear",
    description:
      "Practical, easy-care garments for medical and care teams that need reliable supply, consistent standards, and hygienic materials.",
    features: ["Hygienic materials", "Consistent sizing", "Easy-care fabrics"],
    heroImage: "/medical.png",
    images: catalogImages("Healthcare and clinical wear", [
      "Medical scrubs.png",
    ]),
  },
  {
    slug: "industrial-and-operations-wear",
    sector: "Industrial",
    title: "Industrial and operations wear",
    description:
      "Practical garments for logistics, manufacturing, and field teams that need durability and clear fulfilment across large order volumes.",
    features: ["Built for daily use", "Bulk production and delivery", "Reflective safety trims"],
    heroImage: "/industrial2.png",
    heroImagePosition: "object-top",
    images: catalogImages("Industrial and operations wear", [
      "blue industrial uniform.png",
      "orange industrial uniform.png",
    ]),
  },
  {
    slug: "government-and-public-sector",
    sector: "Government",
    title: "Government and public sector",
    description:
      "Structured supply for public agencies and statutory bodies with compliance requirements and well-documented approval processes.",
    features: ["Compliance-ready", "Structured tender support", "Documented approval trail"],
    heroImage: "/teams.png",
    heroImagePosition: "object-top",
    images: catalogImages("Government and public sector", [
      "Mau Enak Kopitiam polo (front).PNG",
      "Morning star zipper.PNG",
    ]),
  },
];

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
