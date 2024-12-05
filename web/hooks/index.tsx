import { useEffect } from "react";
import { analytics } from "@/utils/analytics";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { useAnalyticCreateMutation } from "@/gql/schemas";
import moment from "moment";

export function useIdentifyAnalytics() {
  const location = useRouter();
  const state = useSelector((state: RootState) => state.app);
  const [analyticCreate] = useAnalyticCreateMutation();

  useEffect(() => {
    analytics.identify("").then(() => {
      analyticCreate({
        variables: {
          anonymousId: "",
          userId: state.authUserId,
          userTraits: "",
          path: location.pathname,
          url: location.route,
          channel: "web",
          event: "",
          eventItems: "",
        },
      });
      console.log("identified one user...");
    });
  }, [location]);
}

export function usePageAnalytics() {
  const location = useRouter();
  const state = useSelector((state: RootState) => state.app);
  const [analyticCreate] = useAnalyticCreateMutation();

  useEffect(() => {
    analytics.page().then(() => {
      analyticCreate({
        variables: {
          anonymousId: "",
          userId: state.authUserId,
          userTraits: "",
          path: location.pathname,
          url: location.route,
          channel: "web",
          event: "",
          eventItems: "",
        },
      });
      console.log("viewed one page...");
    });
  }, [location]);
}

interface TrackProps {
  eventName: string;
  items?: any;
  identifyId?: any;
  pageId?: any;
}

export function useTrackAnalytics({ eventName, items }: TrackProps) {
  const location = useRouter();
  const state = useSelector((state: RootState) => state.app);
  const [analyticCreate] = useAnalyticCreateMutation();


  useEffect(() => {
    analytics
      .track(eventName, {
        items: items,
      })
      .then(() => {
        analyticCreate({
          variables: {
            anonymousId: "",
            userId: state.authUserId,
            userTraits: "",
            path: location.pathname,
            url: location.route,
            channel: "web",
            event: "",
            eventItems: "",
          },
        });
        console.log("tracked one item...");
      });
  }, [location]);
}
