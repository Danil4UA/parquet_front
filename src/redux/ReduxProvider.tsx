"use client";
import store from "./store";
import { Provider } from "react-redux";
import React from 'react';

export const ReduxProvider = ({children}: {children: React.ReactNode}) => (
    <Provider store={store}>{children}</Provider>
)
