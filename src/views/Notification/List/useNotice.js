import React from "react";
import { useSelector } from "react-redux";

const useNotice = () => {
  const [dataList, setDataList] = React.useState([]);
  const [dataUnread, setDataUnread] = React.useState(0);

  const { update } = useSelector(({ notice }) => notice);
  React.useEffect(() => {
    setDataList((items) => {
      const target = items.find((item) => item.id === update.id);
      if (target) {
        if (target.status !== update.status) {
          if (update.status === 0) setDataUnread((n) => n + 1);
          if (update.status === 1) setDataUnread((n) => n - 1);
        }
        Object.assign(target, update);
      }
      return items;
    });
  }, [update]);

  const { remove } = useSelector(({ notice }) => notice);
  React.useEffect(() => {
    setDataList((items) => items.filter((item) => item.id !== remove.id));
    if (remove.status === 0) {
      setDataUnread((n) => n - 1);
    }
  }, [remove]);

  return [dataList, setDataList, dataUnread, setDataUnread];
};

export { useNotice };
