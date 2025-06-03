"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface InfiniteScrollWrapperProps<T> {
  items: T[];
  isLoading: boolean;
  isFetching: boolean;
  hasMore: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  renderLoading: () => React.ReactNode;
  renderNoData?: () => React.ReactNode;
  onFetchMore: () => void;
  onRefresh?: () => void;
  gridCols?: string;
  keyExtractor?: (item: T) => string;
}

const InfiniteScrollWrapper = <T,>({
  items,
  isLoading,
  isFetching,
  hasMore,
  renderItem,
  renderLoading,
  renderNoData,
  onFetchMore,
  onRefresh,
  gridCols = "grid-cols-1",
  keyExtractor,
}: InfiniteScrollWrapperProps<T>) => {
  const [displayItems, setDisplayItems] = useState<T[]>([]);

  useEffect(() => {
    if (items && !isLoading && !isFetching) {
      setDisplayItems((prev) => {
        if (!keyExtractor) return [...prev, ...items];
        const existingKeys = new Set(prev.map(keyExtractor));
        const newItems = items.filter(
          (item) => !existingKeys.has(keyExtractor(item))
        );
        return [...prev, ...newItems];
      });
    }
  }, [items, isLoading, isFetching, keyExtractor]);

  useEffect(() => {
    if (!isLoading && !isFetching && items.length === 0) {
      setDisplayItems([]);
    }
  }, [items, isLoading, isFetching]);

  if (isLoading) {
    return (
      <section className="w-full space-y-3 rounded-2xl">
        {renderLoading()}
      </section>
    );
  }

  if (!isLoading && displayItems.length === 0) {
    return (
      <section className="w-full space-y-3 rounded-2xl">
        {renderNoData ? (
          renderNoData()
        ) : (
          <h1 className="text-center text-gray-500 py-8">No items available</h1>
        )}
      </section>
    );
  }

  return (
    <section className="w-full space-y-3 rounded-2xl">
      <InfiniteScroll
        dataLength={displayItems.length}
        next={onFetchMore}
        hasMore={hasMore}
        loader={<div className="mt-3">{renderLoading()}</div>}
        refreshFunction={onRefresh}
        pullDownToRefresh={!!onRefresh}
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>↓ Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>↑ Release to refresh</h3>
        }
      >
        <div className={`w-full grid ${gridCols} gap-3`}>
          {displayItems.map((item, index) => renderItem(item, index))}
        </div>
      </InfiniteScroll>
    </section>
  );
};

export default InfiniteScrollWrapper;
