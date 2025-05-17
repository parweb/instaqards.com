'use client';

export const getClusterColor = (count: number) => {
  if (count <= 10) {
    return {
      from: 'from-emerald-500',
      via: 'via-green-500',
      to: 'to-teal-600',
      border: 'border-emerald-600',
      text: 'text-emerald-600'
    };
  } else if (count <= 50) {
    return {
      from: 'from-blue-500',
      via: 'via-indigo-500',
      to: 'to-violet-600',
      border: 'border-indigo-600',
      text: 'text-indigo-600'
    };
  } else if (count <= 100) {
    return {
      from: 'from-amber-500',
      via: 'via-orange-500',
      to: 'to-red-600',
      border: 'border-amber-600',
      text: 'text-amber-600'
    };
  } else {
    return {
      from: 'from-rose-500',
      via: 'via-pink-500',
      to: 'to-red-600',
      border: 'border-rose-600',
      text: 'text-rose-600'
    };
  }
};
