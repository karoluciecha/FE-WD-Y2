import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  private _ready: Promise<void>;

  constructor(private storage: Storage) {
    // Start initialization of the storage
    this._ready = this.init();
  }

  // Initializes the storage system
  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Waits for storage to be ready before use
  async ready(): Promise<void> {
    return this._ready;
  }

  // ===== Generic Storage Methods =====

  // Retrieves the value for a given key from storage
  async get(key: string): Promise<any> {
    return this._storage?.get(key);
  }

  // Saves a value to storage under a given key
  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  // Removes a specific key-value pair from storage
  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  // Clears all keys and values from storage
  async clear(): Promise<void> {
    await this._storage?.clear();
  }

  // ===== User Session Helpers =====

  // Retrieves the currently stored username
  async getUsername(): Promise<string> {
    return (await this._storage?.get('username')) || '';
  }

  // Stores a username
  async setUsername(value: string): Promise<void> {
    await this._storage?.set('username', value);
  }

  // Removes the stored username
  async removeUsername(): Promise<void> {
    await this._storage?.remove('username');
  }

  // Checks if a user is logged in (boolean flag)
  async isLoggedIn(): Promise<boolean> {
    return (await this._storage?.get('isLoggedIn')) || false;
  }

  // Sets the login state of the user
  async setLoggedIn(value: boolean): Promise<void> {
    await this._storage?.set('isLoggedIn', value);
  }

    // ===== Theme Preference Helpers =====

  // Gets the stored preference for dark mode, defaults to true
  async getThemePreference(): Promise<boolean> {
    const stored = await this._storage?.get('isDarkMode');
    return stored !== null ? stored : true;
  }

  // Sets the user's dark mode preference
  async setThemePreference(value: boolean): Promise<void> {
    await this._storage?.set('isDarkMode', value);
  }
}