import { observer } from 'mobx-react-lite';
import { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Grid, Loader } from 'semantic-ui-react';
import { PagingParams } from '../../../app/models/pagination';
import { useStore } from '../../../app/stores/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

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

  return (
    <Grid>
      <Grid.Column width="10">
        {loadingIinitial && !loadingNext ? (
          <Fragment>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </Fragment>
        ) : (
          <InfiniteScroll pageStart={0} loadMore={handleGetNext} initialLoad={false}
                hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}>
            <ActivityList />
          </InfiniteScroll>
        )}
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
