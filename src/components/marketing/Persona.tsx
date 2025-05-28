import Image from 'next/image';
import { cn } from 'lib/utils';
import { boldonse } from 'styles/fonts';
import { Job } from 'data/job';

interface PersonaProps {
  profession: Job['id'];
  selected: boolean;
  imageUrl?: string;
}

export const Persona = ({
  profession,
  selected,
  imageUrl = `/assets/personas/${profession}.png`
}: PersonaProps) => {
  return (
    <div
      className={cn(
        'group flex cursor-pointer flex-col items-center gap-3 transition-all duration-300 ease-in-out hover:scale-105',
        selected ? 'scale-100' : 'scale-90'
      )}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          priority
          className={cn(
            'rounded-2xl border-4 transition-all duration-300',
            selected
              ? 'border-black shadow-xl'
              : 'border-gray-200 shadow-lg group-hover:border-gray-300'
          )}
          src={imageUrl}
          alt={`Photo profil ${profession}`}
          width={200}
          height={200}
        />
      </div>

      <span
        className={cn(
          boldonse.className,
          'rounded-full px-6 py-2 font-light transition-colors duration-300',
          selected
            ? 'bg-stone-200 text-black'
            : 'text-gray-600 group-hover:bg-stone-100 group-hover:text-black'
        )}
      >
        {profession}
      </span>
    </div>
  );
};
