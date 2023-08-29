import { useMemo } from "react";

const applyMiddleware = (dispatch, additionalAPI) => (action) => {
    if (typeof action === "function") {
        return action(dispatch, additionalAPI);
    }

    return dispatch(action);
};

const getActionCreators = (actionCreators, dispatch) =>
    Object.entries(actionCreators).reduce(
        (memo, [type, action]) => ({
            ...memo,
            [type]:
                typeof action === "function"
                    ? dispatch(action)
                    : (payload) => dispatch({ type, payload }),
        }),
        {}
    );

const useActions = (types, dispatch, customActionCreators, additionalAPI) => {
    const enhancedDispatch = applyMiddleware(dispatch, additionalAPI);
    const actionCreators = { ...types, ...(customActionCreators || {}) };

    return useMemo(
        () => getActionCreators(actionCreators, enhancedDispatch),
        [types, customActionCreators] //eslint-disable-line react-hooks/exhaustive-deps
    );
};

export default useActions;
