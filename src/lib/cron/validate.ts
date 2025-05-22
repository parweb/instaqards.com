export async function validateCronFunction(
  modulePath: string,
  functionName: string
): Promise<() => Promise<any>> {
  let mod;
  try {
    mod = await import(`crons/${modulePath}`);
  } catch (e) {
    throw new Error(`Module ${modulePath} introuvable`);
  }
  if (!mod[functionName] || typeof mod[functionName] !== 'function') {
    throw new Error(`Fonction ${functionName} introuvable dans ${modulePath}`);
  }
  return mod[functionName];
}
