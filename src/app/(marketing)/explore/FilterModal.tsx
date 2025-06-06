'use client';

import {
  LuBriefcase,
  LuBuilding2,
  LuCircleCheck,
  LuFilter,
  LuMapPin,
  LuSearch,
  LuSparkles,
  LuUserCheck,
  LuUsers
} from 'react-icons/lu';

import { Button } from 'components/ui/button';
import { Checkbox } from 'components/ui/checkbox';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { RadioGroup, RadioGroupItem } from 'components/ui/radio-group';
import { Switch } from 'components/ui/switch';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'components/ui/select';

export const FilterModal = () => {
  return (
    <div className="dark:from-background/80 animate-fade-in rounded-2xl border border-purple-200/40 bg-gradient-to-br from-white/80 via-purple-50/80 to-blue-100/80 shadow-2xl backdrop-blur-2xl dark:border-purple-900/40 dark:via-purple-950/60 dark:to-blue-950/60">
      <div className="relative flex min-w-[28rem] flex-col gap-6 p-8">
        <header className="mb-2 flex items-center gap-3">
          <span className="animate-bounce-in inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 p-2 shadow-lg">
            <LuFilter className="drop-shadow-glow animate-spin-slow size-7 text-white" />
          </span>
          <h2 className="animate-fade-in bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-md">
            Filtres magiques
          </h2>
        </header>

        <main>
          <div className="flex flex-col gap-8">
            {/* Recherche texte */}
            <div className="animate-slide-in flex flex-col gap-2">
              <Label
                htmlFor="search"
                className="flex items-center gap-2 text-base font-semibold"
              >
                <LuSearch className="size-4 text-purple-400" /> Recherche
              </Label>
              <Input
                id="search"
                placeholder="Nom, entreprise, email..."
                className="dark:bg-background/60 rounded-xl border-2 border-purple-200/60 bg-white/70 shadow-inner focus:border-pink-400 focus:ring-2 focus:ring-pink-200/40"
              />
            </div>

            <div className="animate-fade-in grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Ville */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="city"
                  className="flex items-center gap-2 font-semibold"
                >
                  <LuMapPin className="size-4 text-blue-400" /> Ville
                </Label>
                <Select>
                  <SelectTrigger
                    id="city"
                    className="dark:bg-background/60 w-full rounded-xl border-2 border-blue-200/60 bg-white/70 shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-200/40"
                  >
                    <SelectValue placeholder="Choisir une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paris">Paris</SelectItem>
                    <SelectItem value="lyon">Lyon</SelectItem>
                    <SelectItem value="marseille">Marseille</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Département */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="state"
                  className="flex items-center gap-2 font-semibold"
                >
                  <LuBuilding2 className="size-4 text-purple-400" /> Département
                </Label>
                <Select>
                  <SelectTrigger
                    id="state"
                    className="dark:bg-background/60 w-full rounded-xl border-2 border-purple-200/60 bg-white/70 shadow-inner focus:border-purple-400 focus:ring-2 focus:ring-purple-200/40"
                  >
                    <SelectValue placeholder="Choisir un département" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="75">75 - Paris</SelectItem>
                    <SelectItem value="69">69 - Rhône</SelectItem>
                    <SelectItem value="13">13 - Bouches-du-Rhône</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activité */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="activity"
                  className="flex items-center gap-2 font-semibold"
                >
                  <LuBriefcase className="size-4 text-pink-400" /> Activité
                </Label>
                <Select>
                  <SelectTrigger
                    id="activity"
                    className="dark:bg-background/60 w-full rounded-xl border-2 border-pink-200/60 bg-white/70 shadow-inner focus:border-pink-400 focus:ring-2 focus:ring-pink-200/40"
                  >
                    <SelectValue placeholder="Choisir une activité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boulangerie">Boulangerie</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="coiffeur">Coiffeur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Type de profil (RadioGroup) */}
              <div className="flex flex-col gap-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <LuUsers className="size-4 text-blue-400" /> Type de profil
                </Label>
                <RadioGroup
                  defaultValue="all"
                  className="mt-1 flex flex-row gap-4 pl-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">Tous</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="pro" id="pro" />
                    <Label htmlFor="pro">Pro</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="particulier" id="particulier" />
                    <Label htmlFor="particulier">Particulier</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Séparateur visuel */}
            <div className="animate-grow-in my-2 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200" />

            {/* Options avancées */}
            <div className="animate-fade-in flex flex-col gap-8 md:flex-row">
              {/* Filtres multiples (checkbox) */}
              <div className="flex flex-1 flex-col gap-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <LuFilter className="size-4 text-purple-400" /> Options
                </Label>
                <div className="mt-1 flex flex-col gap-3 pl-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="hasPhone" />
                    <Label htmlFor="hasPhone">Avec téléphone</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="hasCompany" />
                    <Label htmlFor="hasCompany">Avec entreprise</Label>
                  </div>
                </div>
              </div>

              {/* Switch exemple */}
              <div className="flex flex-1 flex-col gap-2">
                <Label className="flex items-center gap-2 font-semibold">
                  <LuUserCheck className="size-4 text-green-400" /> Statut
                </Label>
                <div className="mt-1 flex items-center gap-3 pl-2">
                  <Switch id="verified" />
                  <Label htmlFor="verified" className="flex items-center gap-1">
                    <LuCircleCheck className="size-4 text-green-400" /> Comptes
                    vérifiés uniquement
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex flex-col gap-2 pt-6">
          <Button className="animate-pop-in w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 py-3 text-lg font-bold shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-600">
            <span className="inline-flex items-center gap-2">
              <LuFilter className="animate-sparkle drop-shadow-glow size-5 text-white" />
              Appliquer les filtres magiques
            </span>
          </Button>
          <span className="animate-fade-in text-center text-xs text-purple-400/80 italic">
            Trouvez exactement ce que vous cherchez, en un éclair <LuSparkles />
          </span>
        </footer>
      </div>
    </div>
  );
};
