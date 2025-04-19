export const formatPhoneNumber = (phone: string | null): string => {
  if (!phone) return '';

  // Supprimer tous les caractères non numériques
  let numbers = phone.replace(/\D/g, '');

  // Gérer les différents formats d'entrée
  if (numbers.startsWith('33')) {
    numbers = '0' + numbers.slice(2);
  } else if (!numbers.startsWith('0')) {
    numbers = '0' + numbers;
  }

  // S'assurer que nous avons 10 chiffres
  if (numbers.length !== 10) {
    return phone; // Retourner le numéro original si le format est invalide
  }

  // Formatter en groupes de 2 chiffres (0X XX XX XX XX)
  return numbers.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
};
