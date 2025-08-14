import { notFound } from "next/navigation";

import { BlogCard, BlogHeader } from "@/components/blog-card";
import { CategoryNavigation } from "@/components/category-navigation";
import { PageBuilder } from "@/components/pagebuilder";
import { SimpleSearch } from "@/components/search/simple-search";
import { sanityFetch } from "@/lib/sanity/live";
import { client } from "@/lib/sanity/client";
import { queryBlogsByCategory, queryCategories, queryCategoryBySlug } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}



export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { data: categoryData } = await sanityFetch({ 
    query: queryCategoryBySlug, 
    params: { slug },
    stega: false,
  });
  
  if (!categoryData) {
    return getSEOMetadata({
      title: "Category Not Found",
      description: "The requested category could not be found.",
    });
  }

  const { name, description } = categoryData;
  return getSEOMetadata({
    title: `${name} - Blog Posts`,
    description: description || `Browse all blog posts in the ${name} category.`,
    slug: `/category/${slug}`,
  });
}

export async function generateStaticParams() {
  try {
    const categories = await client.fetch(queryCategories);
    
    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return [];
    }
    
    const validSlugs = categories
      .filter((category: any) => category?.slug?.current)
      .map((category: any) => {
        return { slug: category.slug.current };
      });
    
    return validSlugs;
    
  } catch (error) {
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  // Fetch category data
  const { data: categoryData } = await sanityFetch({ 
    query: queryCategoryBySlug, 
    params: { slug } 
  });
  
  // Fetch categories for navigation
  const { data: categories } = await sanityFetch({ query: queryCategories });
  
  // Fetch blogs for this category
  const { data: blogs } = await sanityFetch({ 
    query: queryBlogsByCategory, 
    params: { category: slug } 
  });

  if (!categoryData) {
    notFound();
  }

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader 
          title={`${categoryData.name} Posts`} 
          description={categoryData.description || `All blog posts in the ${categoryData.name} category.`} 
        />
        
        {/* Category Navigation */}
        {categories.length > 0 && (
          <div className="mt-8 mb-6">
            <CategoryNavigation categories={categories} />
          </div>
        )}
        
        {/* Search Component */}
        <div className="mt-8 mb-12">
          <SimpleSearch blogs={blogs} />
        </div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
