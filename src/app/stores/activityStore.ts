import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
  activities: Activity[] = [];
  selectedActivity: Activity | null = null;
  editMode = false;
  loading = false;
  loadingIinitial = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadActivites = async () => {
    this.setLoadingInitial(true);
    try {
      const activities = await agent.Activities.list();
      activities.forEach(a => this.activities.push({ ...a, date: a.date.split('T')[0] }));
    } catch (e) {
      console.error(e);
    }
    this.setLoadingInitial(false);
  }
  
  setLoadingInitial = (state: boolean) => this.loadingIinitial = state;
}
