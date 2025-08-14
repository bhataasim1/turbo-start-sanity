"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@workspace/ui/components/badge";

interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  blogCount: number;
}

interface CategoryNavigationProps {
  categories: Category[];
  showAll?: boolean;
}

const colorVariants = {
  blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
  green: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  purple: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
  orange: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200",
  red: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
  yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
  pink: "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-200",
  indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200",
};

export function CategoryNavigation({ categories, showAll = true }: CategoryNavigationProps) {
  const pathname = usePathname();
  const isAllActive = pathname === "/blog";

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {showAll && (
        <Link href="/blog">
          <Badge
            variant="outline"
            className={`cursor-pointer transition-colors ${
              isAllActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            }`}
          >
            All Posts
          </Badge>
        </Link>
      )}
      
      {categories.map((category) => {
        const isActive = pathname === `/category/${category.slug}`;
        const colorClass = colorVariants[category.color as keyof typeof colorVariants] || colorVariants.blue;
        
        return (
          <Link key={category._id} href={`/category/${category.slug}`}>
            <Badge
              variant="outline"
              className={`cursor-pointer transition-colors border ${
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : colorClass
              }`}
            >
              {category.name}
              <span className="ml-1 text-xs opacity-75">({category.blogCount})</span>
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
