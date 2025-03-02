import { useReducer, useEffect } from "react";

const initialState = {
  result: [],
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  if (action.type === "LOADING") {
    return {
      result: [],
      loading: true,
      error: null,
    };
  }

  if (action.type === "RESPONSE_COMPLETE") {
    return {
      result: action.payload.response,
      loading: false,
      error: null,
    };
  }

  if (action.type === "ERROR") {
    return {
      result: [],
      loading: false,
      error: action.payload.error,
    };
  }

  return state;
};

const useFetch = (url, processResponse) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    dispatch({ type: "LOADING" });

    const fetchUrl = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          dispatch({
            type: "ERROR",
            payload: {
              error: `Failed to fetch data, response.status: ${response.status}`,
            },
          });
          return;
        }
        let data = await response.json();
        if (processResponse) {
          data = processResponse(data);
        }
        dispatch({ type: "RESPONSE_COMPLETE", payload: { response: data } });
      } catch (error) {
        dispatch({ type: "ERROR", payload: { error } });
      }
    };

    fetchUrl();
  }, []);

  return [state.result, state.loading, state.error];
};

export default useFetch;
