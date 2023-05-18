const STORAGE_TOKEN = '5FUFRM30ZGT2TL1U71ILFGSO4KYDUCQ5ROAYXNGA';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Sets an item in the storage.
 * 
 * @param {string} key - The key of the item.
 * @param {string} value - The value to be stored.
 * @returns {Promise<object>} - A promise that resolves to the response object.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
      .then(res => res.json());
  }
  
  
  /**
   * Retrieves an item from the storage.
   * 
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string>} - A promise that resolves to the retrieved value.
   * @throws {string} - Throws an error if the requested data is not found.
   */
  async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
          return res.data.value;
        }
        throw `Could not find data with key "${key}".`;
      });
  }
  