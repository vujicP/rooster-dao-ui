import React from 'react';
import { AddContract } from '../AddContract';
import { Homepage, Contract, InstantiateWithCode, InstantiateWithHash } from '../pages';

export const routes = [
  {
    path: '/contract/:addr',
    component: Contract,
    exact: true,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/add-contract',
    component: AddContract,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate-with-hash',
    component: InstantiateWithHash,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/instantiate-with-code',
    component: InstantiateWithCode,
    exact: false,
    fallback: <div> Loading... </div>,
  },
  {
    path: '/',
    component: Homepage,
    exact: true,
    fallback: <div> Loading... </div>,
  },
];