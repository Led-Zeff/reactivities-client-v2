import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { FollowPredicate, Photo, Profile, ProfileActivity, ProfileActivityPredicate, ProfileFormValues } from '../models/profile';
import { store } from './store';

export default class ProfileStore {
  profile: Profile | null = null;
  followings: Profile[] = [];
  activities: ProfileActivity[] = [];

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

  updateFollowing = async (username: string, following: boolean) => {
    try {
      await agent.Profiles.updateFollowing(username);
      store.activityStore.updateAttendeeFollowing(username);
      runInAction(() => {
        if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
          following ? this.profile.followersCount++ : this.profile.followersCount--;
          this.profile.following = !this.profile.following;
        }

        if (this.profile && this.profile.username === store.userStore.user?.username) {
          following ? this.profile.followingCount++ : this.profile.followingCount--;
        }

        this.followings.forEach(following => {
          if (following.username === username) {
            following.following ? following.followersCount-- : following.followersCount++;
            following.following = !following.following;
          }
        })
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadFollowings = async (predicate: FollowPredicate) => {
    try {
      const followings = await agent.Profiles.getFollowings(this.profile!.username, predicate);
      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      console.log(error);
    }
  };

  loadProfileActivities = async (predicate: ProfileActivityPredicate) => {
    try {
      const activities = await agent.Profiles.getActivities(this.profile!.username, predicate);
      runInAction(() => this.activities = activities.map(activity => {
        activity.date = new Date(activity.date);
        return activity;
      }));
    } catch (error) {
      console.log(error);
    }
  }
}