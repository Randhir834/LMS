import { useEffect, useRef } from 'react';
import { socketService } from '@/services/socketService';

export const useSocket = (userId?: number) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current && userId) {
      socketService.connect(userId);
      isInitialized.current = true;
    }

    return () => {
      // Don't disconnect on unmount as we want to keep the connection
      // across different pages for the same user session
    };
  }, [userId]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isSocketConnected(),
    onLiveClassScheduled: socketService.onLiveClassScheduled.bind(socketService),
    offLiveClassScheduled: socketService.offLiveClassScheduled.bind(socketService)
  };
};
