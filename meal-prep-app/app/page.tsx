// app/page.tsx
import { supabase } from '@/utils/supabase/client';
import { Database } from '@/types/supabase'; // We'll create this type in a moment!

// 1. Define the type for a Recipe row
// This is critical for TypeScript development!
type Recipe = Database['public']['Tables']['recipes']['Row'];

// 2. Server Component Function
// The 'async' keyword tells Next.js this is a Server Component.
export default async function Index() {
  // Fetch data directly from Supabase. Next.js caches this by default.
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_available', true); // Only fetch available meals

  if (error) {
    console.error('Error fetching recipes:', error);
    return <div>Error loading menu. Please check your Supabase connection and RLS policies.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-green-700">
          Meal Prep MVP Menu
        </h1>
      </header>

      <main className="container mx-auto p-4 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          This Week&apos;s Meals ({recipes.length})
        </h2>
        
        {/* 3. Grid Layout for Recipe Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              {/* Optional: Placeholder for the image */}
              <div className="h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                [Image Placeholder]
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2 text-green-600">{recipe.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{recipe.description}</p>
                
                {/* Macro Display */}
                <div className="flex justify-between text-xs font-medium text-gray-700 mt-3">
                  <div className="text-center">
                    <span className="block text-lg font-extrabold text-blue-600">{recipe.total_protein_g}g</span>
                    <span className="block">Protein</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-extrabold text-red-600">{recipe.total_carb_g}g</span>
                    <span className="block">Carbs</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-extrabold text-yellow-600">{recipe.total_fat_g}g</span>
                    <span className="block">Fat</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${recipe.price}</span>
                  <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-150">
                    Add to Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}