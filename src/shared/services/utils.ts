/**
 * 
 * @param baseUrl - included /first/getEnv, no backslash as prefix
 * @param key 
 * @returns 
 */
export async function getEnv(baseUrl: string, key: string): Promise<string | undefined> {
  const apiUrl = baseUrl + key;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data && data.value) {
    return data.value;
  }

  return undefined;
}

export async function getEnvs(baseUrl: string, keys: string): Promise<JSON> {
  const apiUrl = baseUrl + keys;
  const response = await fetch(apiUrl);
  const data = await response.json();

  return(data);

}