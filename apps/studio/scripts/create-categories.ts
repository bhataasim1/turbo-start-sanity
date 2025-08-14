import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // You'll need to set this environment variable
});

const sampleCategories = [
  {
    _type: 'category',
    name: 'Sanity',
    description: 'Content management and development with Sanity CMS',
    slug: { current: 'sanity' },
    color: 'blue',
  },
  {
    _type: 'category',
    name: 'Next.js',
    description: 'React framework for production applications',
    slug: { current: 'nextjs' },
    color: 'green',
  },
  {
    _type: 'category',
    name: 'Web Development',
    description: 'General web development topics and tutorials',
    slug: { current: 'web-development' },
    color: 'purple',
  },
  {
    _type: 'category',
    name: 'Design',
    description: 'UI/UX design principles and best practices',
    slug: { current: 'design' },
    color: 'orange',
  },
  {
    _type: 'category',
    name: 'Performance',
    description: 'Website performance optimization and best practices',
    slug: { current: 'performance' },
    color: 'red',
  },
];

async function createCategories() {
  try {
    console.log('Creating sample categories...');
    
    for (const category of sampleCategories) {
      const result = await client.create(category);
      console.log(`Created category: ${result.name} (${result._id})`);
    }
    
    console.log('All categories created successfully!');
  } catch (error) {
    console.error('Error creating categories:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  createCategories();
}
