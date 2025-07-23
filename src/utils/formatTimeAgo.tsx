import moment from "moment";

  const formatTimeAgo = (createdAt: string | Date) => {
    if (!createdAt) return "";
    const now = moment();
    const postTime = moment(
      typeof createdAt === "string" ? createdAt : createdAt.toISOString()
    );
    const diffSeconds = now.diff(postTime, "seconds");
    const diffMinutes = now.diff(postTime, "minutes");
    const diffHours = now.diff(postTime, "hours");
    const diffDays = now.diff(postTime, "days");

    if (diffSeconds < 60) {
      return diffSeconds === 1 ? "1s" : `${diffSeconds}s`;
    } else if (diffMinutes < 60) {
      return diffMinutes === 1 ? "1m" : `${diffMinutes}m`;
    } else if (diffHours < 24) {
      return diffHours === 1 ? "1h" : `${diffHours}h`;
    } else if (diffDays < 7) {
      return diffDays === 1 ? "1d" : `${diffDays}d`;
    } else {
      return postTime.format("MMM D, YYYY");
    }
  };

  export default formatTimeAgo;