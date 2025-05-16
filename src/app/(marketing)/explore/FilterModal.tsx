'use client';

import {
  Briefcase,
  Building2,
  CheckCircle2,
  Filter,
  MapPin,
  Search,
  UserCheck,
  Users
} from 'lucide-react';

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
    <div className="bg-gradient-to-br from-white/80 via-purple-50/80 to-blue-100/80 dark:from-background/80 dark:via-purple-950/60 dark:to-blue-950/60 backdrop-blur-2xl rounded-2xl shadow-2xl border border-purple-200/40 dark:border-purple-900/40 animate-fade-in">
      <div className="flex flex-col gap-6 p-8 min-w-[28rem] relative">
        <header className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center justify-center bg-gradient-to-tr from-purple-400 via-pink-400 to-blue-400 rounded-full p-2 shadow-lg animate-bounce-in">
            <Filter className="text-white size-7 drop-shadow-glow animate-spin-slow" />
          </span>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-600 to-blue-600 bg-clip-text text-transparent tracking-tight drop-shadow-md animate-fade-in">
            Filtres magiques
          </h2>
        </header>

        <main>
          <div className="flex flex-col gap-8">
            {/* Recherche texte */}
            <div className="flex flex-col gap-2 animate-slide-in">
              <Label
                htmlFor="search"
                className="text-base font-semibold flex items-center gap-2"
              >
                <Search className="size-4 text-purple-400" /> Recherche
              </Label>
              <Input
                id="search"
                placeholder="Nom, entreprise, email..."
                className="rounded-xl border-2 border-purple-200/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-200/40 bg-white/70 dark:bg-background/60 shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {/* Ville */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="city"
                  className="font-semibold flex items-center gap-2"
                >
                  <MapPin className="size-4 text-blue-400" /> Ville
                </Label>
                <Select>
                  <SelectTrigger
                    id="city"
                    className="w-full rounded-xl border-2 border-blue-200/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-200/40 bg-white/70 dark:bg-background/60 shadow-inner"
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
                  className="font-semibold flex items-center gap-2"
                >
                  <Building2 className="size-4 text-purple-400" /> Département
                </Label>
                <Select>
                  <SelectTrigger
                    id="state"
                    className="w-full rounded-xl border-2 border-purple-200/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-200/40 bg-white/70 dark:bg-background/60 shadow-inner"
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
                  className="font-semibold flex items-center gap-2"
                >
                  <Briefcase className="size-4 text-pink-400" /> Activité
                </Label>
                <Select>
                  <SelectTrigger
                    id="activity"
                    className="w-full rounded-xl border-2 border-pink-200/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-200/40 bg-white/70 dark:bg-background/60 shadow-inner"
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
                <Label className="font-semibold flex items-center gap-2">
                  <Users className="size-4 text-blue-400" /> Type de profil
                </Label>
                <RadioGroup
                  defaultValue="all"
                  className="flex flex-row gap-4 pl-2 mt-1"
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
            <div className="w-full h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 rounded-full my-2 animate-grow-in" />

            {/* Options avancées */}
            <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
              {/* Filtres multiples (checkbox) */}
              <div className="flex flex-col gap-2 flex-1">
                <Label className="font-semibold flex items-center gap-2">
                  <Filter className="size-4 text-purple-400" /> Options
                </Label>
                <div className="flex flex-col gap-3 pl-2 mt-1">
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
              <div className="flex flex-col gap-2 flex-1">
                <Label className="font-semibold flex items-center gap-2">
                  <UserCheck className="size-4 text-green-400" /> Statut
                </Label>
                <div className="flex items-center gap-3 pl-2 mt-1">
                  <Switch id="verified" />
                  <Label htmlFor="verified" className="flex items-center gap-1">
                    <CheckCircle2 className="size-4 text-green-400" /> Comptes
                    vérifiés uniquement
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="pt-6 flex flex-col gap-2">
          <Button className="w-full py-3 text-lg font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 animate-pop-in">
            <span className="inline-flex items-center gap-2">
              <Filter className="size-5 animate-sparkle text-white drop-shadow-glow" />
              Appliquer les filtres magiques
            </span>
          </Button>
          <span className="text-xs text-center text-purple-400/80 italic animate-fade-in">
            Trouvez exactement ce que vous cherchez, en un éclair ✨
          </span>
        </footer>
      </div>
    </div>
  );
};
