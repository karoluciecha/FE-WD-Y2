import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;

  private _ready: Promise<void>;

  constructor(private storage: Storage) {
    this._ready = this.init();
  }

  private async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async ready(): Promise<void> {
    return this._ready;
  }

  // ===== Generic =====

  async get(key: string): Promise<any> {
    return this._storage?.get(key);
  }

  async set(key: string, value: any): Promise<void> {
    await this._storage?.set(key, value);
  }

  async remove(key: string): Promise<void> {
    await this._storage?.remove(key);
  }

  async clear(): Promise<void> {
    await this._storage?.clear();
  }

  // ===== Specific Helpers =====

  async getUsername(): Promise<string> {
    return (await this._storage?.get('username')) || '';
  }

  async setUsername(value: string): Promise<void> {
    await this._storage?.set('username', value);
  }

  async removeUsername(): Promise<void> {
    await this._storage?.remove('username');
  }

  async isLoggedIn(): Promise<boolean> {
    return (await this._storage?.get('isLoggedIn')) || false;
  }

  async setLoggedIn(value: boolean): Promise<void> {
    await this._storage?.set('isLoggedIn', value);
  }

  async getThemePreference(): Promise<boolean> {
    const stored = await this._storage?.get('isDarkMode');
    return stored !== null ? stored : true;
  }

  async setThemePreference(value: boolean): Promise<void> {
    await this._storage?.set('isDarkMode', value);
  }
}