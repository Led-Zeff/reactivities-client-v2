import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity, ActivityFormValues } from '../models/activity';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';
import { store } from './store';
import { Profile } from '../models/profile';
import { Pagination, PagingParams } from '../models/pagination';

export default class ActivityStore {
  activityRegistry = new Map<string, Activity>();
  selectedActivity: Activity | undefined = undefined;
  loading = false;
  loadingIinitial = true;
  pagination: Pagination | null = null;
  pagingParams = new PagingParams();

  constructor() {
    makeAutoObservable(this);
  }

  setPagingParams = (pagingParams: PagingParams) => this.pagingParams = pagingParams;

  get axiosParams() {
    const params = new URLSearchParams();
    params.append('pageNumber', this.pagingParams.pageNumber.toString());
    params.append('pageSize', this.pagingParams.pageSize.toString());
    return params;
  }

  get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  get groupedActivities() {
    return Object.entries(this.activitiesByDate.reduce((activities, activity) => {
      const date = format(activity.date, 'dd MMM yyyy');
      if (!activities[date]) {
        activities[date] = [activity];
      } else {
        activities[date].push(activity);
      }
      return activities;
    }, {} as { [key: string]: Activity[] }));
  }

  loadActivites = async () => {
    try {
      const activities = await agent.Activities.list(this.axiosParams);
      activities.data.forEach(this.addToRegistry);
      this.setPagination(activities.pagination);
    } catch (e) {
      console.error(e);
    }
    this.setLoadingInitial(false);
  }

  setPagination = (pagination: Pagination) => {
    this.pagination = pagination;
  };

  loadActivity =  async (id: string) => {
    const activity = this.activityRegistry.get(id)
      ?? await this.getActivity(id);
    this.selectActivity(activity);
  }

  private getActivity = async (id: string) => {
    this.setLoading(true);
    try {
      const activity = await agent.Activities.detail(id);
      this.addToRegistry(activity);
      return this.activityRegistry.get(id);
    } catch (error) {
      console.error(error);
    } finally {
      this.setLoading(false);
    }
  };

  private addToRegistry = (activity: Activity) => {
    const user = store.userStore.user;
    if (user) {
      activity.isGoing = activity.attendees?.some(a => a.username === user.username);
      activity.isHost = activity.hostUsername === user.username;
      activity.host = activity.attendees?.find(a => a.username === activity.hostUsername);
    }

    this.activityRegistry.set(activity.id, { ...activity, date: new Date(activity.date) })
  }
  
  setLoadingInitial = (state: boolean) => this.loadingIinitial = state;
  setLoading = (state: boolean) => this.loading = state;
  selectActivity = (activity?: Activity) => this.selectedActivity = activity;

  createActivity = async (activity: ActivityFormValues) => {
    const user = store.userStore.user;
    const attendee = new Profile(user!);
    activity.id = uuid();
    try {
      await agent.Activities.create(activity);
      const newActivity = new Activity(activity);
      newActivity.hostUsername = user?.username!;
      newActivity.attendees = [attendee];
      this.addToRegistry(newActivity);
      this.selectActivity(newActivity);
    } catch (e) {
      console.error(e);
    }
    return activity;
  };

  updateActivity = async (activity: ActivityFormValues) => {
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        if (activity.id) {
          const updatedActivity = {...this.activityRegistry.get(activity.id), ...activity};
          this.activityRegistry.set(activity.id, updatedActivity as Activity);
          this.selectActivity(updatedActivity as Activity);
        }
      });
    } catch (error) {
      console.error(error);
    }
    return activity;
  };

  deleteActivity = async (id: string) => {
    this.setLoading(true);
    try {
      await agent.Activities.delete(id);
      runInAction(() => { 
        this.activityRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
    this.setLoading(false);
  };

  updateAttendance = async () => {
    const user = store.userStore.user;
    if (!this.selectedActivity || !user) return;

    try {
      await agent.Activities.attend(this.selectedActivity.id);
      runInAction(() => {
        if (this.selectedActivity?.isGoing) {
          this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user.username);
          this.selectedActivity.isGoing = false;
        } else {
          this.selectedActivity?.attendees?.push(new Profile(user));
          this.selectedActivity!.isGoing = true;
        }
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    }
  };

  cancelActivityToggle = async () => {
    try {
      await agent.Activities.attend(this.selectedActivity!.id);
      runInAction(() => {
        this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
        this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
      });
    } catch (error) {
      console.log(error);
    }
  }

  clearSelectedActivity = () => {
    this.selectedActivity = undefined;
  }

  updateAttendeeFollowing = (username: string) => {
    this.activityRegistry.forEach(activity => {
      activity.attendees.forEach(attendee => {
        if (attendee.username === username) {
          attendee.following ? attendee.followersCount-- : attendee.followersCount++;
          attendee.following = !attendee.following;
        }
      });
    })
  };
}
