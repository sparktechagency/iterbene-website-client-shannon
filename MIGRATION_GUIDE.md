# Migration Guide: Infinite Scroll and Modal Fixes

## Overview
This guide helps you migrate components to use the new reusable `useInfiniteScroll` hook and updated modal handling.

## Changes Made

### 1. Created `useInfiniteScroll` Hook
Location: `src/hooks/useInfiniteScroll.ts`

### 2. Updated `CustomModal` Component
- Fixed scroll position preservation
- Added `modal-content` class
- Improved cleanup

### 3. Updated `AuthModal` Component  
- Fixed spacebar blocking issue
- Improved modal background scroll prevention
- Better cleanup and restoration

### 4. Added Global CSS Rules
```css
/* Modal fixes */
body.modal-open {
  position: fixed !important;
  overflow: hidden !important;
  width: 100% !important;
}

.modal-content {
  overflow-y: auto;
}
```

## How to Migrate Components

### Before (Old Pattern):
```tsx
// OLD - Remove these
const [loading, setLoading] = useState(false);
const observer = useRef<IntersectionObserver | null>(null);

// OLD - Remove this callback
const lastPostElementRef = useCallback(
  (node: HTMLDivElement | null) => {
    if (isLoading || isFetching) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  },
  [isLoading, isFetching, hasMore]
);

// OLD - Remove duplicate observer useEffect
useEffect(() => {
  // ... complex observer logic
}, [loadMore, loading, hasMore]);

// OLD - Remove sentinel div
<div id="sentinel" style={{ height: "1px" }} />
```

### After (New Pattern):
```tsx
// NEW - Add import
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

// NEW - Remove old observer refs and callbacks, just use the hook
const { lastElementRef } = useInfiniteScroll({
  isLoading,
  isFetching,
  hasMore: hasMore && !loading, // your conditions here
  onLoadMore: () => setCurrentPage((prev) => prev + 1),
  threshold: 0.1,
  rootMargin: '100px'
});

// NEW - Use lastElementRef instead of lastPostElementRef
<div key={item._id} ref={lastElementRef}>
  <YourComponent item={item} />
</div>
```

## Components to Update

The following components need migration:

1. `src/components/pages/PhotosPage/PhotosPage.tsx`
2. `src/components/pages/watch-video/watch-video.tsx`
3. `src/components/pages/UserProfilePage/UserTimeline/UserTimeline.tsx`
4. `src/components/pages/UserProfilePage/MyConnectionsPage/MyConnections/MyConnections.tsx`
5. `src/components/pages/UserProfilePage/MyConnectionsPage/MyRequestConnections/MyRequestConnections.tsx`
6. `src/components/pages/UserProfilePage/MyGroupsPage/MyInvitationsGroup/MyInvitationsGroups.tsx`
7. `src/components/pages/UserProfilePage/MyGroupsPage/MyJoinedGroups/MyJoinedGroups.tsx`
8. `src/components/pages/UserProfilePage/MyInvitationsPage/MyUpComingTours/MyUpComingTours.tsx`
9. `src/components/pages/UserProfilePage/MyInvitationsPage/MyInvitationsEvent/MyInvitationsEvent.tsx`
10. `src/components/pages/message-inbox/chats/chats.tsx`
11. `src/components/pages/UserProfilePage/UserVideos/UserVideos.tsx`
12. `src/components/pages/UserProfilePage/UserIteItinerary/UserIteItinerary.tsx`
13. `src/components/pages/UserProfilePage/UserPhotos/UserPhotos.tsx`
14. `src/components/pages/events/event-details/EventDiscussion/EventPost.tsx`
15. `src/components/pages/search/LocationPlaces.tsx`
16. `src/components/pages/search/PostsLocationsSearch.tsx`
17. `src/components/pages/message-inbox/messages/message-body.tsx`
18. `src/components/pages/groups/group-details/GroupDiscussion/GroupPost.tsx`

## Migration Steps for Each Component

1. **Add import**: `import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";`

2. **Remove old code**:
   - Remove `observer = useRef<IntersectionObserver | null>(null);`
   - Remove `loadMore` callback if exists
   - Remove `lastPostElementRef` callback
   - Remove duplicate `useEffect` with observer logic
   - Remove `<div id="sentinel" style={{ height: "1px" }} />` if exists

3. **Add new hook**:
   ```tsx
   const { lastElementRef } = useInfiniteScroll({
     isLoading,
     isFetching, 
     hasMore: hasMore && !loading,
     onLoadMore: () => setCurrentPage((prev) => prev + 1),
     threshold: 0.1,
     rootMargin: '100px'
   });
   ```

4. **Update ref usage**: Change `lastPostElementRef` to `lastElementRef`

## Benefits

✅ **Consistent behavior** across all components  
✅ **Reduced code duplication**  
✅ **Better performance** with optimized observer logic  
✅ **Fixed scroll freezing** issues  
✅ **Proper cleanup** prevents memory leaks  
✅ **Fixed modal scroll** and input issues  

## Testing

After migration, test each component to ensure:
- Infinite scrolling works smoothly
- No scroll freezing occurs
- Loading states work correctly  
- Modals don't break scrolling
- Input fields work properly (especially spacebar)