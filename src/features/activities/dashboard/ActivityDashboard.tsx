import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import Loading from '../../../app/layout/Loading';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {
  const {activityStore: {loadActivites, loadingIinitial, setPagingParams, pagination}} = useStore();
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams((pagination?.currentPage ?? 0) + 1));
    loadActivites().finally(() => setLoadingNext(false));
  }

  useEffect(() => {
    loadActivites();
  }, [loadActivites]);

  if (loadingIinitial && !loadingNext) return <Loading content="Loading activities..." />;

  return (
    <Grid>
      <Grid.Column width="10">
        <InfiniteScroll pageStart={0} loadMore={handleGetNext} initialLoad={false}
              hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}>
          <ActivityList />
        </InfiniteScroll>
      </Grid.Column>

      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>

      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
});
