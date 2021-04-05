import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Photo, Profile, ProfileFormValues } from '../models/profile';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isCurrentUser() {
    if (store.userStore.user && this.profile) {
      return store.userStore.user.username === this.profile.username;
    }
    return false;
  }

  loadProfile = async (username: string) => {
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => this.profile = profile);
    } catch (error) {
      console.log(error);
    }
  };

  updateProfile = async (profile: ProfileFormValues) => {
    try {
      await agent.Profiles.update(profile);
      runInAction(() => {
        this.profile = {...this.profile, ...profile} as Profile;
        store.userStore.setDisplayname(profile.displayName);
      });
    } catch (error) {
      console.log(error);
    }
  };

  uploadPhoto = async (file: Blob) => {
    try {
      const response = await agent.Profiles.uploadPhoto(file);
      const photo = response.data;
      runInAction(() => {
        if (this.profile) {
          this.profile.photos?.push(photo);
          if (photo.isMain && store.userStore.user) {
            store.userStore.setImage(photo.url);
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  setMainPhoto = async (photo: Photo) => {
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      store.userStore.setImage(photo.url);
      runInAction(() => {
        if (this.profile?.photos) {
          this.profile.photos.forEach(p => p.isMain = p.id === photo.id);
          this.profile.image = photo.url;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  deletePhoto = async (photo: Photo) => {
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
          if (photo.isMain) {
            store.userStore.setImage(undefined);
            this.profile.image = undefined;
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}