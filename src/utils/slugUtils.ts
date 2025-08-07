/**
 * Utility functions for generating SEO-friendly slugs
 */

export const generateSlug = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
};

export const generatePartSlug = (partName: string, brand?: string): string => {
  let slug = partName;

  // If brand is provided and not already in the name, prepend it
  if (brand && !partName.toLowerCase().includes(brand.toLowerCase())) {
    slug = `${brand} ${partName}`;
  }

  return generateSlug(slug);
};

export const generateUniqueSlug = (
  baseSlug: string,
  existingSlugs: string[]
): string => {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
