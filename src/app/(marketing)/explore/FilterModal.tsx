'use client';

import { Button } from "components/ui/button";

export const FilterModal = () => {
  return <div className="bg-white/70 backdrop-blur-md rounded-md">
    <div className="flex flex-col gap-4 p-4 min-w-96">
      <header>
        <h2>Filtres</h2>
      </header>

      <main>
        
      </main>

      <footer>
        <Button className="w-full">Appliquer</Button>
      </footer>
    </div>
  </div>;
};