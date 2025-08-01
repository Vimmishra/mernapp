import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./movies/searchSlice";

const store = configureStore({
  reducer: {
    MovieSearch: searchSlice,
  },
});

export default store;
